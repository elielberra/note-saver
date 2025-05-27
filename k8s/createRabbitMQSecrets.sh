#!/bin/bash

kubectl delete secret rabbitmq-conf --ignore-not-found
kubectl create secret generic rabbitmq-conf \
  --from-file=rabbitmq.conf=rabbitmq/files/rabbitmq.conf

kubectl delete secret rabbitmq-definitions --ignore-not-found
kubectl create secret generic rabbitmq-definitions \
  --from-file="load_definition.json"=rabbitmq/files/definitions.json

# TODO: Change path of files
