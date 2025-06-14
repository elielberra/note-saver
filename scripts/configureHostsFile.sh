#!/bin/bash -e

# Directory paths
scriptDir=$(realpath $(dirname $0))
rootProjectDir="$(dirname "${scriptDir}")"
localCACertificatesDir="/usr/local/share/ca-certificates"

# Parse utility functions
source "${scriptDir}/utils.sh"

setAndValidateEnvironment $@

if [[ "${environment}" == "${DOCKER_COMPOSE}" ]]; then
    environmentIp="127.0.0.1"
else
    environmentIp=$(minikube ip)
fi

# Entry for resolving domains to localhost IP
domains="${environment}.notesaver ${environment}.server.notesaver ${environment}.kibana.notesaver ${environment}.rabbitmq.notesaver"
entry="${environmentIp}    ${domains}"
hostsFile="/etc/hosts"
finalMessage="Completed configuring hosts file"

# Check if the entry already exists in /etc/hosts
if grep -q "${domains}" "${hostsFile}"; then
    echo "Entry already exists in ${hostsFile}"
    echo "${finalMessage}"
    exit
fi
# If it doesn't exist, append it to /etc/hosts
echo "${entry}" | sudo tee -a "${hostsFile}" > /dev/null
echo "Entry added to ${hostsFile}"
echo "${finalMessage}"
