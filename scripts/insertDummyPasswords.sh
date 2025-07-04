#!/bin/bash

# Directory paths
scriptDir=$(realpath $(dirname $0))
rootProjectDir="$(dirname "${scriptDir}")"

# Parse utility functions
source "${scriptDir}/utils.sh"

setAndValidateEnvironment $@

# Set list of directories with .env_dummy files based on the environment
if [[ "${environment}" == "${DOCKER_COMPOSE}" ]]; then
    dirsWithEnvDummyFile=( "consumer" "db" "elastic-kibana/base_credentials" "elastic-kibana/elastic" "scripts" "server")
else
    dirsWithEnvDummyFile=( "k8s/db/files" "k8s/consumer/files" "k8s/elastic-kibana/files" "k8s/server/files" "scripts" )
fi

dummyFile=".env_dummy"
envFile=".env"

# Iterate over each file
for dir in "${dirsWithEnvDummyFile[@]}"; do
    if [ -f "${dir}/${envFile}" ]; then
        echo "The environment variables file ${dir}/${envFile} already exists, skipping"
        continue
    fi
    cp "${dir}/${dummyFile}" "${dir}/${envFile}"
    # Replace all keys containing 'PASSWORD' or 'SECRET' with dummy passwords
    sed -i 's/^\(.*\(PASSWORD\|SECRET\|PASSPHRASE\).*=*\).*/\1password/' "${dir}/${envFile}"
    echo "Inserted dummy passwords into ${dir}/${envFile}"
done
