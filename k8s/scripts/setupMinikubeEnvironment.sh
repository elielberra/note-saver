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
minikube addons enable ingress
bash "${rootProjectDir}/k8s/scripts/createNamespace.sh"
bash "${rootProjectDir}/scripts/insertDummyPasswords.sh" "--environment" "${ENVIRONMENT}"
bash "${rootProjectDir}/scripts/configureDevSslCerts.sh" "--environment" "${ENVIRONMENT}"
bash "${rootProjectDir}/scripts/configureHostsFile.sh" "--environment" "${ENVIRONMENT}"
bash "${rootProjectDir}/k8s/scripts/createSslSecrets.sh"
bash "${rootProjectDir}/k8s/scripts/createElasticSecrets.sh"
bash "${rootProjectDir}/k8s/scripts/createPostgresqlSecrets.sh"
bash "${rootProjectDir}/k8s/scripts/createRabbitmqSecrets.sh"
kubectl apply -k "${rootProjectDir}/k8s"
