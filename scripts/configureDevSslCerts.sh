# The creation of the certificates was based on Chrstian Lempa's post:
# https://www.patreon.com/posts/109937722
# Adding the certs to the browser NSS DB was based on Thomas Leister's post"
# https://thomas-leister.de/en/how-to-import-ca-root-certificate/

#!/bin/bash -e

insertCertIntoNSSDB() {
    local browserNSSDBDir=$1
    # Check if a prevoous certificate exists before deleting it
    if certutil -L -n "${certificateAuthorityName}" -d sql:"${browserNSSDBDir}" &> /dev/null; then
        # Delete previous CA from Network Security Services Database of the browser
        certutil -D -n "${certificateAuthorityName}" -d sql:"${browserNSSDBDir}"
    fi
    # Run query to insert CA on NSS DB
    certutil -A -n "${certificateAuthorityName}" -t "TCu,Cu,Tu" -i "${localCACertificatesDir}/${CAFilename}" -d sql:"${browserNSSDBDir}"
}

# Directory paths
scriptDir=$(realpath $(dirname $0))
rootProjectDir="$(dirname "${scriptDir}")"
localCACertificatesDir="/usr/local/share/ca-certificates"

# Parse utility functions
source "${scriptDir}/utils.sh"

setAndValidateEnvironment $@

# Set sslCertsDir based on the environment
if [[ "${environment}" == "${DOCKER_COMPOSE}" ]]; then
    sslCertsDir="${rootProjectDir}/ssl-certs"
else
    sslCertsDir="${rootProjectDir}/k8s/ssl-certs"
fi

# Default Certificate Properties
country="AR"
state="Ciudad Autónoma de Buenos Aires"
locality="Ciudad Autónoma de Buenos Aires"
company="NoteSaver"
organization="NoteSaver"
organizationUnit="Engineering"
commonName="notesaver"
certificateAuthorityName="NoteSaverCertificateAuthority-${environment}"
certTTL=3650

# Certificate filenames
CAKeyFilename="ca-key.pem"
CAFilename="ca.crt"
certKeyFilename="cert-key.pem"
CSRFilename="cert.csr"
certExtConfFilename="openssl.cnf"
certFilename="cert.pem"

# Check if dependencies are install apt packages if not
verifyAndInstallDependency "certutil" "libnss3-tools"

# Remove previous ssl directory, if exists, and create a new one
[ -d "${sslCertsDir}" ] && sudo rm -rf "${sslCertsDir}"
mkdir "${sslCertsDir}"
cd "${sslCertsDir}"

# Generate CA's key
openssl genrsa -aes256 -out "${CAKeyFilename}" -passout pass:"${CA_PASSPHRASE}" 4096 
# Generate CA
openssl req -new -x509 -sha256 -days ${certTTL} -key "${CAKeyFilename}" -out "${CAFilename}" -passin pass:${CA_PASSPHRASE} \
    -subj "/C=${country}/ST=${state}/L=${locality}/O=${organization}/OU=${organizationUnit}/CN=${commonName}"
echo "The CA was successfully generated"
# Generate Certificate's key
openssl genrsa -out "${certKeyFilename}" -passout pass:"${CERT_PASSPHRASE}" 4096
# Generate Certificate Signing Request
openssl req -new -sha256 -key "${certKeyFilename}" -out "${CSRFilename}" -passin pass:${CA_PASSPHRASE} -subj "/CN=${commonName}" 
# Generate Extension Configuration File for the Certificate
cat > "${certExtConfFilename}" <<EOF
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req

[req_distinguished_name]
countryName = ${country}
countryName_default = ${country}
stateOrProvinceName = ${state}
stateOrProvinceName_default = ${state}
localityName = ${locality}
localityName_default = ${locality}
organizationalUnitName = ${organizationUnit}
organizationalUnitName_default = ${organizationUnit}
commonName = ${commonName}
commonName_max = 64

[ v3_req ]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = ${environment}.${commonName}
DNS.2 = ${environment}.server.${commonName}
EOF

if [[ "${environment}" == "${DOCKER_COMPOSE}" ]]; then
    echo "IP.1 = 127.0.0.1" >> "${certExtConfFilename}"
else
    minikubeIp=$(minikube ip)
    echo "IP.1 = ${minikubeIp}" >> "${certExtConfFilename}"
fi

# CA signs the Certificate Signing Request, generating the Certificate itself
openssl x509 -req -sha256 -days ${certTTL} -in "${CSRFilename}" -CA "${CAFilename}" -CAkey "${CAKeyFilename}" \
    -out "${certFilename}" -extfile "${certExtConfFilename}" -extensions v3_req -CAcreateserial -passin pass:${CA_PASSPHRASE} 
echo "The certificate was successfully generated and signed by the CA"

# If exists, remove the previous certificate of the Operating System and run update
if [ -f ".${localCACertificatesDir}/${CAFilename}" ]; then
    sudo rm "${localCACertificatesDir}/${CAFilename}"
    sudo update-ca-certificates
fi
# Install the CA Certificate as a trusted root CA for the OS
echo "Adding the  CA Certificate as a trusted root CA for the Operating System"
sudo cp "${CAFilename}" "${localCACertificatesDir}"
sudo update-ca-certificates

# Insert CA on Authorized SSL Authorities of the Browsers
# Check if Chrome is installed
if checkIfLibraryIsInstalled "google-chrome"; then
    # Set Network Security Services Database directory
    chromeNSSDBDir="${HOME}/.pki/nssdb"
    echo "Chrome's NSS Database is on ${chromeNSSDBDir}"
    echo "Configuring the CA on Chrome"
    insertCertIntoNSSDB "${chromeNSSDBDir}"
fi
# Same process as the block above
if checkIfLibraryIsInstalled "firefox"; then
    firefoxNSSDBDir="$(dirname "$(sudo find ${HOME} -type d -name "*mozilla*" -exec find {} -name "cert9.db" \;)")"
    echo "Firefox's NSS Database is on ${firefoxNSSDBDir}"
    echo "Configuring the CA on Firefox"
    insertCertIntoNSSDB "${firefoxNSSDBDir}"
fi
echo "Completed configuring SSL Certificates for local development"
