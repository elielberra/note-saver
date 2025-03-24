#!/bin/bash
if [ x${ELASTIC_PASSWORD} == x ]; then
  echo "Set the ELASTIC_PASSWORD environment variable in the .env_elk_credentials file";
  exit 1;
elif [ x${KIBANA_PASSWORD} == x ]; then
  echo "Set the KIBANA_PASSWORD environment variable in the .env_elk_credentials file";
  exit 1;
fi;
echo "Setting the password for the user kibana_system";
until curl -s -X POST -u "elastic:${ELASTIC_PASSWORD}" -H "Content-Type: application/json" http://elastic:9200/_security/user/kibana_system/_password -d "{\"password\":\"${KIBANA_PASSWORD}\"}" | grep -q "^{}"; do sleep 10; done;
echo "The configuration of the credentials for the kibana_system user was successful!";

# TODO: Add script for chaning executable permissions and add it on setupLocalEnvironment.sh list
