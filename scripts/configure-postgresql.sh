#!/bin/bash -e

if ! command -v psql &> /dev/null; then
    read -p "You don't have postgresql installed, do you want to install it? \
It is required for this App to run correctly [Yy/Nn]" -n 1 -r
    echo
    if [[ $REPLY =~ ^[y|Y]$ ]]; then
    echo "Updating packages version list"
    sudo apt update
    echo "Installing postgresql"
    sudo apt install -y postgresql
    else
        echo "Exiting from script, cannot proceed without postgresql"
        exit
    fi
fi

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
