#!/bin/bash -e

# Entry for resolving domains to localhost IP
pattern="127\.0\.0\.1\s*docker-compose\.notesaver docker-compose\.server\.notesaver"
entry="127.0.0.1    docker-compose.notesaver docker-compose.server.notesaver"
hostsFile="/etc/hosts"
finalMessage="Completed configuring hosts file"

# Check if the entry already exists in /etc/hosts
if grep -E "${pattern}" "${hostsFile}"; then
    echo "Entry already exists in ${hostsFile}"
    echo "${finalMessage}"
fi
# If it doesn't exist, append it to /etc/hosts
echo "${entry}" | sudo tee -a "${hostsFile}" > /dev/null
echo "Entry added to ${hostsFile}"
echo "${finalMessage}"
