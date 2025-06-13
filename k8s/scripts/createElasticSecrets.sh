#!/bin/bash

# Directory paths
scriptDir=$(dirname $0)
k8sProjectDir=$(realpath "${scriptDir}/..")
cd "${k8sProjectDir}"

source "./elastic/files/.env"

kubectl delete secret elastic-creds --ignore-not-found
kubectl create secret generic elastic-creds \
  --from-literal=password="${ELASTIC_PASSWORD}"
