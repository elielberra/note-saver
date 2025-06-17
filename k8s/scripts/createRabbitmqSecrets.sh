#!/bin/bash

# Directory paths
scriptDir=$(dirname $0)
k8sProjectDir=$(realpath "${scriptDir}/..")
cd "${k8sProjectDir}"

# Delete previous secrets and create new ones
kubectl delete secret rabbitmq-conf --ignore-not-found -n note-saver
kubectl create secret generic rabbitmq-conf \
  --from-file=rabbitmq.conf=./rabbitmq/files/rabbitmq.conf \
  -n note-saver

kubectl delete secret rabbitmq-definitions --ignore-not-found -n note-saver
kubectl create secret generic rabbitmq-definitions \
  --from-file="load_definition.json"=./rabbitmq/files/load_definition.json \
  -n note-saver
