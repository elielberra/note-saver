#!/bin/bash

# Directory paths
scriptDir=$(dirname $0)
k8sProjectDir=$(realpath "${scriptDir}/..")
cd "${k8sProjectDir}"

kubectl delete secret notesaver-tls --ignore-not-found
kubectl create secret tls notesaver-tls \
  --cert=./ssl-certs/cert.pem \
  --key=./ssl-certs/cert-key.pem
