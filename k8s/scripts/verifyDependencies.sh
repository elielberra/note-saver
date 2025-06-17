#!/bin/bash

# Associative array with dependecies and its correspondant installation guides
declare -A dependencies
dependencies["minikube"]="https://minikube.sigs.k8s.io/docs/start"
dependencies["kubectl"]="https://kubernetes.io/docs/tasks/tools/install-kubectl-linux"
dependencies["flux"]="https://fluxcd.io/flux/installation/#install-the-flux-cli"

missingDependency=false

# Check if each dependency is installed
for dependency in "${!dependencies[@]}"; do
    if ! command -v "${dependency}" &> /dev/null; then
        echo "${dependency} is not installed. Follow these instructions: ${dependencies[$dependency]}"
        missingDependency=true
    fi
done

if [ "$missingDependency" = true ]; then
    exit 1
fi
echo "All required dependencies are already installed"
