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
certificateAuthority="NoteSaverCertificateAuthority"

# Directory paths
# sslCertsDir TODO: Find and Replace
scriptPath="$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
rootProjectPath="$(dirname "${scriptPath}")"
localCACertificatesDir="/usr/local/share/ca-certificates"

# Parse environment variables
source "${scriptPath}/.env"
# TODO: Declare key and certs name as vars

# TODO: Move to utils and create function for DRY
# Check if dependencies are installed
if ! command -v certutil &> /dev/null; then
    echo "You don't have libnss3-tools installed, it is required for this script to execute correctly"
    read -p "Do you want to install it? [Yy/Nn]" -n 1 -r
    echo
    if [[ $REPLY =~ ^[N|n]$ ]]; then
        echo "Exiting from script, cannot proceed without libnss3-tools"
        exit 1
    fi
    echo "Updating packages version list"
    sudo apt update
    echo "Installing libnss3-tools"
    sudo apt install -y libnss3-tools
fi

cd "${rootProjectPath}"
if [ -d "./ssl-certs" ]; then
    rm -rf "./ssl-certs"
fi
mkdir "./ssl-certs"
cd "./ssl-certs"

# Generate CA's key
openssl genrsa -aes256 -out ca-key.pem -passout pass:"${CA_PASSPHRASE}" 4096 
# Generate CA
openssl req -new -x509 -sha256 -days 365 -key ca-key.pem -out ca.pem -passin pass:${CA_PASSPHRASE} \
    -subj "/C=${country}/ST=${state}/L=${locality}/O=${organization}/OU=${organizationUnit}/CN=${commonName}"
# Generate Certificate's key
openssl genrsa -out cert-key.pem -passout pass:"${CERT_PASSPHRASE}" 4096
# Generate Certificate Signing Request
openssl req -new -sha256 -key cert-key.pem -out cert.csr  -passin pass:${CA_PASSPHRASE} -subj "/CN=${commonName}" 
# Generate Extension Configuration File for the Certificate
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
openssl x509 -req -sha256 -days 365 -in cert.csr -CA ca.pem -CAkey ca-key.pem -out cert.pem -extfile openssl.cnf -extensions v3_req -CAcreateserial -passin pass:${CA_PASSPHRASE} 

for app in "client" "server"; do
    if [ -d "../${app}/ssl-certs" ]; then
        rm -rf "../${app}/ssl-certs"
    fi
    # TODO: USE vars
    mkdir "../${app}/ssl-certs"
    cp cert-key.pem cert.pem "../${app}/ssl-certs"
done

# TODO: This block might be unncessary
# If exists, remove the preovious certificate and run update
if [ -f "./usr/local/share/ca-certificates/ca.crt" ]; then
    sudo rm "/usr/local/share/ca-certificates/ca.crt"
    sudo update-ca-certificates
fi
# Install the CA Certificate as a trusted root CA for the OS
sudo cp ca.pem /usr/local/share/ca-certificates/ca.crt
sudo update-ca-certificates

# TODO: Check if Chrome or Mozilla are installed
# TODO: Delete previous certificates to avoid duplicate collision
# Insert CA on Authorized SSL Authorities of the Browsers
# Insert CA on Network Security Services Database of Chrome
chromeNSSDBDir="${HOME}/.pki/nssdb"
certutil -A -n "${certificateAuthority}" -t "TCu,Cu,Tu" -i /usr/local/share/ca-certificates/ca.crt -d sql:"${chromeNSSDBDir}"
# Insert CA on Network Security Services Database of Firefox
# firefoxNSSDBDir="$(dirname "$(sudo find ${HOME} -type d -name "*mozilla*" -exec find {} -name "cert9.db" \;)")"
# certutil -A -n ""${certificateAuthority}" -t "TCu,Cuw,Tuw" -i /usr/local/share/ca-certificates/ca.crt -d sql:"${firefoxNSSDBDir}"

# Append domains to /etc/hosts
