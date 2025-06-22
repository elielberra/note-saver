#!/bin/bash

createNamespaceIfNotExists() {
    local targetNamespace=$1
    # Create the monitoring namespace only if it doesn't already exist
    kubectl get namespace "$targetNamespace" > /dev/null 2>&1 || kubectl create namespace "$targetNamespace"
}

# Call the function for each namespace
createNamespaceIfNotExists note-saver
createNamespaceIfNotExists monitoring
