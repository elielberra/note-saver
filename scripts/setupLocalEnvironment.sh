#!/bin/bash -e

scriptDir=$(realpath $(dirname $0))
bash "${scriptDir}"/insertDummyPasswords.sh
bash "${scriptDir}"/configureDevSSLCerts.sh
bash "${scriptDir}"/configureHostsFile.sh

# Add script for sudo sysctl -w vm.max_map_count=262144