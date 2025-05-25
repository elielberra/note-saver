#!/bin/bash

kubectl delete secret rabbitmq-conf --ignore-not-found
kubectl create secret generic rabbitmq-conf \
  --from-file=rabbitmq.conf=../rabbitmq/rabbitmq-k8s.conf

kubectl delete secret rabbitmq-definitions --ignore-not-found
kubectl create secret generic rabbitmq-definitions \
  --from-file="load_definition.json"=../rabbitmq/definitions.json
