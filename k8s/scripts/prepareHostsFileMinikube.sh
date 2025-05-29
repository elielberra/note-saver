#!/bin/bash -e

hostsFile="/etc/hosts"
domain_entry="notesaver server.notesaver"

# Get Minikube IP
minikube_ip=$(minikube ip)
new_entry="${minikube_ip}    ${domain_entry}"

# Remove any existing lines with the exact domain entry
if grep -qE "\\s*notesaver server\\.notesaver" "${hostsFile}"; then
    echo "Removing existing 'notesaver server.notesaver' entries..."
    sudo sed -i.bak "/\\s*notesaver server\\.notesaver/d" "${hostsFile}"
fi

# Add new entry with Minikube IP
echo "${new_entry}" | sudo tee -a "${hostsFile}" > /dev/null
echo "Added: ${new_entry}"
echo "Completed updating ${hostsFile} with Minikube IP and notesaver domains"
