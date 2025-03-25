#!/bin/bash

dummyFile=".env_dummy"
envFile=".env"
# List of directories with .env_dummy files
dirsWithEnvDummyFile=("server" "db" "scripts" "consumer" "elk/base_credentials")
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
    sed -i 's/^\(.*\(PASSWORD\|SECRET\|PASSPHRASE\).*=*\).*/\1password/' "${dir}/${envFile}"
    echo "Inserted dummy passwords into ${dir}/${envFile}"
done
