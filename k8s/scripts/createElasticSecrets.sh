#!/bin/bash

# Directory paths
scriptDir=$(dirname $0)
k8sProjectDir=$(realpath "${scriptDir}/..")
cd "${k8sProjectDir}"

source "./elastic-kibana/files/.env"

kubectl delete secret elastic-password --ignore-not-found -n note-saver
kubectl create secret generic elastic-password \
  --from-literal=password="${ELASTIC_PASSWORD}" \
  -n note-saver
