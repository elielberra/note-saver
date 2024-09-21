#!/bin/bash -e

# Entry for resolving domains to localhost IP
pattern="127\.0\.0\.1\s*notesaver server\.notesaver"
hostsFile="/etc/hosts"

# Check if the entry already exists in /etc/hosts
if ! grep -E "127\.0\.0\.1\s*notesaver server\.notesaver" "${hostsFile}"; then
    # If it doesn't exist, append it to /etc/hosts
    echo "$pattern" | sudo tee -a "${hostsFile}" > /dev/null
    echo "Entry added to ${hostsFile}"
else
    echo "Entry already exists in ${hostsFile}"
fi
echo "Completed configuring hosts file"
