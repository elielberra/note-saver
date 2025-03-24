#!/bin/bash

if [ x"${ELASTIC_PASSWORD}" == x ]; then
  echo "The ELASTIC_PASSWORD environment variable is not set";
  exit 1;
elif [ x"${KIBANA_PASSWORD}" == x ]; then
  echo "The KIBANA_PASSWORD environment variable is not set";
  exit 1;
fi;

echo "Setting the password for the user kibana_system";

if curl -s -o /dev/null -w "%{http_code}" -X POST -u "elastic:${ELASTIC_PASSWORD}" -H "Content-Type: application/json" http://elastic:9200/_security/user/kibana_system/_password -d "{\"password\":\"${KIBANA_PASSWORD}\"}" | grep -q "200"; then
  echo "Password set successfully.";
  exit 0;
else
  echo "Failed to set password.";
  exit 1;
fi;
