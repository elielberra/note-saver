#!/bin/bash

ENVIRONMENT="minikube"

# Directory paths
scriptDir=$(dirname $0)
rootProjectDir=$(realpath "${scriptDir}/../..")

minikube start
flux install
minikube addons enable ingress
bash "${rootProjectDir}/scripts/configureDevSSLCerts.sh" "--environment" "${ENVIRONMENT}"
bash "${rootProjectDir}/scripts/configureHostsFile.sh" "--environment" "${ENVIRONMENT}"
bash "${rootProjectDir}/k8s/scripts/createSslSecrets.sh"
bash "${rootProjectDir}/k8s/scripts/createPostgresqlSecrets.sh"
bash "${rootProjectDir}/k8s/scripts/createRabbitmqSecrets.sh"
kubectl apply -k "${rootProjectDir}/k8s"
