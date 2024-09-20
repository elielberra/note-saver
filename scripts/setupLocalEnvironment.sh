#!/bin/bash

scriptDir=$(realpath $(dirname $0))
bash "${scriptDir}"/configureDevSSLCerts.sh
bash "${scriptDir}"/configureHostsFile.sh
bash "${scriptDir}"/insertDummyPasswords.sh
