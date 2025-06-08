#!/bin/bash

# Directory paths
scriptDir=$(dirname $0)
k8sProjectDir=$(realpath "${scriptDir}/..")
cd "${k8sProjectDir}"

kubectl delete secret rabbitmq-conf --ignore-not-found
kubectl create secret generic rabbitmq-conf \
  --from-file=rabbitmq.conf=./rabbitmq/files/rabbitmq.conf

kubectl delete secret rabbitmq-definitions --ignore-not-found
kubectl create secret generic rabbitmq-definitions \
  --from-file="load_definition.json"=./rabbitmq/files/load_definition.json
