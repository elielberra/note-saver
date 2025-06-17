#!/bin/bash

# Directory paths
scriptDir=$(dirname $0)
k8sProjectDir=$(realpath "${scriptDir}/..")
cd "${k8sProjectDir}"

source "./db/files/.env"

# Delete previous secret and create a new one
kubectl delete secret postgresql-passwords --ignore-not-found -n note-saver
kubectl create secret generic postgresql-passwords \
  --from-literal=password="${POSTGRES_USER}" \
  --from-literal=postgres-password="${POSTGRES_PASSWORD}" \
  -n note-saver
