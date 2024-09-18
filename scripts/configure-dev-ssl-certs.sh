#!/bin/bash -e

# The creation of the certificates was based on Chrstian Lempa's post https://www.patreon.com/posts/109937722
# Adding the certs to the browser NSS DB was based on Thomas Leister's post https://thomas-leister.de/en/how-to-import-ca-root-certificate/

# Default Certificate Properties
country="AR"
state="Ciudad Autónoma de Buenos Aires"
locality="Ciudad Autónoma de Buenos Aires"
company="NoteSaver"
organization="NoteSaver"
organizationUnit="Engineering"
commonName="notesaver"
certificateAuthorityName="NoteSaverCertificateAuthority"

# Certificate filenames
CAKeyFilename="ca-key.pem"
CAFilename="ca.pem"
certKeyFilename="cert-key.pem"
CSRFilename="cert.csr"
certFilename="cert.pem"

# Directory paths
scriptDir="$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
rootProjectDir="$(dirname "${scriptDir}")"
sslCertsDir="ssl-certs"
localCACertificatesDir="/usr/local/share/ca-certificates"

# Parse environment variables and utility functions
source "${scriptDir}/.env"
source "${scriptDir}/utils.sh"

# Check if dependencies are install apt packages if not
verifyAndInstallDependency "certutil" "libnss3-tools"

# Remove previus ssl directory, if exists, and create a new one
cd "${rootProjectDir}"
if [ -d "./${sslCertsDir}" ]; then
    rm -rf "./${sslCertsDir}"
fi
mkdir "./${sslCertsDir}"
cd "./${sslCertsDir}"

# Generate CA's key
openssl genrsa -aes256 -out "${CAKeyFilename}" -passout pass:"${CA_PASSPHRASE}" 4096 
# Generate CA
openssl req -new -x509 -sha256 -days 365 -key "${CAKeyFilename}" -out "${CAFilename}" -passin pass:${CA_PASSPHRASE} \
    -subj "/C=${country}/ST=${state}/L=${locality}/O=${organization}/OU=${organizationUnit}/CN=${commonName}"
# Generate Certificate's key
openssl genrsa -out "${certKeyFilename}" -passout pass:"${CERT_PASSPHRASE}" 4096
# Generate Certificate Signing Request
openssl req -new -sha256 -key "${certKeyFilename}" -out "${CSRFilename}" -passin pass:${CA_PASSPHRASE} -subj "/CN=${commonName}" 
# Generate Extension Configuration File for the Certificate
# TODO: Check if defaults can be deleted
cat > openssl.cnf <<EOF
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
DNS.1 = ${commonName}
DNS.2 = server.${commonName}
IP.1 = 127.0.0.1
EOF

# CA signs the Certificate Signing Request, generating the Certificate itself
# TODO: Check if setting .crt instead of .pem works
openssl x509 -req -sha256 -days 365 -in "${CSRFilename}" -CA "${CAFilename}" -CAkey "${CAKeyFilename}" -out "${certFilename}" -extfile openssl.cnf -extensions v3_req -CAcreateserial -passin pass:${CA_PASSPHRASE} 

for app in "client" "server"; do
    if [ -d "../${app}/${sslCertsDir}" ]; then
        rm -rf "../${app}/${sslCertsDir}"
    fi
    # TODO: USE vars
    mkdir "../${app}/${sslCertsDir}"
    cp "${certKeyFilename}" "${certFilename}" "../${app}/${sslCertsDir}"
done

# TODO: This block might be unncessary
# If exists, remove the preovious certificate and run update
if [ -f ".${localCACertificatesDir}/ca.crt" ]; then
    sudo rm "${localCACertificatesDir}/ca.crt"
    sudo update-ca-certificates
fi
# Install the CA Certificate as a trusted root CA for the OS
sudo cp "${CAFilename}" "${localCACertificatesDir}/ca.crt"
sudo update-ca-certificates

# TODO: Check if Chrome or Mozilla are installed
# TODO: Delete previous certificates to avoid duplicate collision
# Insert CA on Authorized SSL Authorities of the Browsers
# Insert CA on Network Security Services Database of Chrome
chromeNSSDBDir="${HOME}/.pki/nssdb"
certutil -A -n "${certificateAuthorityName}" -t "TCu,Cu,Tu" -i "${localCACertificatesDir}/ca.crt" -d sql:"${chromeNSSDBDir}"
# Insert CA on Network Security Services Database of Firefox
firefoxNSSDBDir="$(dirname "$(sudo find ${HOME} -type d -name "*mozilla*" -exec find {} -name "cert9.db" \;)")"
certutil -A -n "${certificateAuthorityName}" -t "TCu,Cuw,Tuw" -i "${localCACertificatesDir}/ca.crt" -d sql:"${firefoxNSSDBDir}"

# Append domains to /etc/hosts
