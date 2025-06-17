#!/bin/bash

# Directory paths
scriptDir=$(dirname $0)
k8sProjectDir=$(realpath "${scriptDir}/..")
cd "${k8sProjectDir}"

source "./elastic-kibana/files/.env"

# Delete previous secrets and create new ones
kubectl delete secret elastic-password --ignore-not-found -n note-saver
kubectl create secret generic elastic-password \
  --from-literal=elasticsearch-password="${ELASTIC_PASSWORD}" \
  -n note-saver

kubectl delete secret kibana-password --ignore-not-found -n note-saver
kubectl create secret generic kibana-password \
  --from-literal=kibana-password="${KIBANA_PASSWORD}" \
  -n note-saver
