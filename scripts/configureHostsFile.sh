#!/bin/bash -e

# Entry for matching domain to IP
entry="127.0.0.1 notesaver server.notesaver"
hostsFile="/etc/hosts"

# Check if the entry already exists in /etc/hosts
if ! grep -qF "$entry" "${hostsFile}"; then
    # If it doesn't exist, append it to /etc/hosts
    echo "$entry" | sudo tee -a "${hostsFile}" > /dev/null
    echo "Entry added to ${hostsFile}"
else
    echo "Entry already exists in ${hostsFile}"
fi
