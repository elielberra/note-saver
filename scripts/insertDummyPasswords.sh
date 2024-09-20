#!/bin/bash

dummyFile=".env_dummy"
envFile=".env"
# List of directories with .env_dummy files
dirsWithEnvDummyFile=("server" "db" "scripts")
scriptDir=$(realpath $(dirname $0))
rootProjectDir="$(dirname "${scriptDir}")"

cd "${rootProjectDir}"

# Iterate over each file
for dir in "${dirsWithEnvDummyFile[@]}"; do
    if [ -f "${dir}/${envFile}" ]; then
        echo "The environment variables file ${dir}/${envFile} already exists, skipping"
        continue
    fi
    cp "${dir}/${dummyFile}" "${dir}/${envFile}"
    # Replace all keys containing 'PASSWORD' or 'SECRET' with dummy passwords
    sed -i 's/^\(.*PASSWORD.*=\).*/\1dummy-password/' "${dir}/${envFile}"
    sed -i 's/^\(.*SECRET.*=\).*/\1dummy-secret/' "${dir}/${envFile}"
    echo "Inserted dummy passwords into ${dir}/${envFile}"
done
