#!/bin/bash

scriptDir=$(realpath $(dirname $0))
bash "${scriptDir}"/insertDummyPasswords.sh
bash "${scriptDir}"/configureDevSSLCerts.sh
bash "${scriptDir}"/configureHostsFile.sh