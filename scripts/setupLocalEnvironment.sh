#!/bin/bash -e

scriptDir=$(realpath $(dirname $0))
bash "${scriptDir}/insertDummyPasswords.sh"
bash "${scriptDir}/configureDevSSLCerts.sh""
bash "${scriptDir}/configureHostsFile.sh"
bash "${scriptDir}/addExecPermissions.sh"
bash "${scriptDir}/expandVirtualMemory.sh"
