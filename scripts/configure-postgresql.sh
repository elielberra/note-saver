#!/bin/bash -e

# TODO: Polish this script
scriptPath="$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "${scriptPath}/utils.sh"
verifyAndInstallDependency "psql" "postgresql"

scriptDir=$(realpath $(dirname $0))
serverProjectDir=$(dirname $(dirname "${scriptDir}"))
cd $serverProjectDir
source ".env"
sudo -u postgres -H psql -c "ALTER USER postgres with encrypted password '${DB_PASSWORD}';"
PATTERN_TO_REPLACE="^local\s\+all\s\+postgres.*"
REPLACEMENT_STRING="local   all             postgres                                scram-sha-256"
PSQL_VERSION=$(psql --version | cut -d ' ' -f 3 | cut -d '.' -f 1)
FILE_TO_REPLACE="/etc/postgresql/${PSQL_VERSION}/main/pg_hba.conf"
sudo sed -i "s/${PATTERN_TO_REPLACE}/${REPLACEMENT_STRING}/" "${FILE_TO_REPLACE}"
sudo service postgresql restart
