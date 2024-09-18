#!/bin/bash -e

# The creation of the certificates was based on Chrstian Lempa's post https://www.patreon.com/posts/109937722
# Adding the certs to the browser NSS DB was based on Thomas Leister's post https://thomas-leister.de/en/how-to-import-ca-root-certificate/

# Add validation for checkin if libnss3-tools is installed with `which certuil` 
# Add validation for checking work dir or use hack so that the script can be executed from everywhere

scriptPath="$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
rootProjectPath="$(dirname "${scriptPath}")"

apps=("client" "server")

for app in "${apps[@]}"; do
  echo "Processing $app"
done

sudo rm -rf ssl-certs
mkdir -p ssl-certs
cd ssl-certs

# Generate CA
openssl genrsa -aes256 -out ca-key.pem 4096
openssl req -new -x509 -sha256 -days 365 -key ca-key.pem -out ca.pem
# View Certificate's content
openssl x509 -in ca.pem -text
openssl x509 -in ca.pem -purpose -noout -text

# Generate Certificate
openssl genrsa -out cert-key.pem 4096
openssl req -new -sha256 -subj "/CN=yourcn" -key cert-key.pem -out cert.csr
echo "subjectAltName=DNS:notesaver,IP:127.0.0.0" >> extfile.cnf
openssl x509 -req -sha256 -days 365 -in cert.csr -CA ca.pem -CAkey ca-key.pem -out cert.pem -extfile extfile.cnf -CAcreateserial
openssl verify -CAfile ca.pem -verbose cert.pem

if [ -d "../client/ssl-certs" ]; then
    sudo rm -rf ../client/ssl-certs/
fi
cp -r . ../client/ssl-certs

if [ -d "../server/ssl-certs" ]; then
    sudo rm -rf ../server/ssl-certs
fi
cp -r . ../server/ssl-certs/


# Install the CA Certificate as a trusted root CA for the OS
# TODO: Check why it is not being updated
# TODO: This block might be unncessary
sudo cp ca.pem /usr/local/share/ca-certificates/ca.crt
sudo update-ca-certificates

#For Chrome (change the name of the CA, if it already exists the commmand will fail):
chromeNSSDB="$HOME/.pki/nssdb"
certutil -A -n "My Root CA" -t "TCu,Cu,Tu" -i /usr/local/share/ca-certificates/ca.crt -d sql:"${chromeNSSDB}"
# For firefox
firefoxNSSDB="$(dirname "$(sudo find $HOME -type d -name '*mozilla*' -exec find {} -name 'cert9.db' \;)")"
certutil -A -n "Mozilla CA Test2" -t "TCu,Cuw,Tuw" -i /usr/local/share/ca-certificates/ca.crt -d sql:"${firefoxNSSDB}"

# Append domains to /etc/hosts
