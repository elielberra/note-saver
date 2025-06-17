#!/bin/bash

ENVIRONMENT="minikube"

# Directory paths
scriptDir=$(dirname $0)
rootProjectDir=$(realpath "${scriptDir}/../..")

bash "${rootProjectDir}/k8s/scripts/verifyDependencies.sh"
# Start minikube only if it is not already running
if ! minikube status | grep -q "host: Running"; then
    minikube start
fi
# Install flux on the cluster only if it is not already installed
kubectl get namespace flux-system > /dev/null 2>&1 || flux install
# Enable the ingress addon only if it is not already enabled
if minikube addons list | grep -E 'ingress[[:space:]]' | grep -q 'disabled'; then
    minikube addons enable ingress
fi
# Enable the metrics-server addon only if it is not already enabled
if minikube addons list | grep -E 'metrics-server[[:space:]]' | grep -q 'disabled'; then
    minikube addons enable metrics-server
fi
# Create k8s resources
bash "${rootProjectDir}/k8s/scripts/createNamespace.sh"
bash "${rootProjectDir}/scripts/insertDummyPasswords.sh" "--environment" "${ENVIRONMENT}"
bash "${rootProjectDir}/scripts/configureDevSslCerts.sh" "--environment" "${ENVIRONMENT}"
bash "${rootProjectDir}/scripts/configureHostsFile.sh" "--environment" "${ENVIRONMENT}"
bash "${rootProjectDir}/k8s/scripts/createSslSecrets.sh"
bash "${rootProjectDir}/k8s/scripts/createElasticKibanaSecrets.sh"
bash "${rootProjectDir}/k8s/scripts/createPostgresqlSecrets.sh"
bash "${rootProjectDir}/k8s/scripts/createRabbitmqSecrets.sh"
kubectl apply -k "${rootProjectDir}/k8s/helmrepository"
kubectl apply -k "${rootProjectDir}/k8s"
