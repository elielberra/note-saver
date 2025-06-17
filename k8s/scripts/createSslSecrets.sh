#!/bin/bash

# Directory paths
scriptDir=$(dirname $0)
k8sProjectDir=$(realpath "${scriptDir}/..")
cd "${k8sProjectDir}"

# Delete previous secret and create a new one
kubectl delete secret notesaver-tls --ignore-not-found -n note-saver
kubectl create secret tls notesaver-tls \
  --cert=./ssl-certs/cert.pem \
  --key=./ssl-certs/cert-key.pem \
  -n note-saver
