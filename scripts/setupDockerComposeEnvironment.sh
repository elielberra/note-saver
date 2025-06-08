#!/bin/bash -e

scriptDir=$(realpath $(dirname $0))
bash "${scriptDir}/insertDummyPasswords.sh"
bash "${scriptDir}/configureDevSslCerts.sh"
bash "${scriptDir}/configureHostsFile.sh"
bash "${scriptDir}/addExecPermissions.sh"
