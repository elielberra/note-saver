#!/bin/bash

scriptDir=$(dirname $0)
rootProjectDir=$(realpath "${scriptDir}/../..")

minikube start
flux install
minikube addons enable ingress
bash "${rootProjectDir}/scripts/configureDevSSLCerts.sh" "--environment" "minikube"