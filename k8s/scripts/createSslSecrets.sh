#!/bin/bash

# Directory paths
scriptDir=$(dirname $0)
k8sProjectDir=$(realpath "${scriptDir}/..")
cd "${k8sProjectDir}"

createTlsSecret() {
  local targetNamespace=$1

  echo "Creating TLS secret in namespace: $targetNamespace"

  kubectl delete secret notesaver-tls --ignore-not-found -n "$targetNamespace"
  kubectl create secret tls notesaver-tls \
    --cert=./ssl-certs/cert.pem \
    --key=./ssl-certs/cert-key.pem \
    -n "$targetNamespace"
}

# Call the function for each namespace
createTlsSecret note-saver
createTlsSecret monitoring

