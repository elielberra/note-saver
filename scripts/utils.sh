#!/bin/bash -e

# Returns number indicating if a library is installed so that it can be used on a conditional check
checkIfLibraryIsInstalled() {
    local dependencyCommand="$1"
    if command -v "${dependencyCommand}" &> /dev/null; then
        return 0
    else
        return 1
    fi
}

# If a library is not install, it will install it with the user consent
verifyAndInstallDependency() {
    local command=$1
    local dependencyName=$2
    if ! checkIfLibraryIsInstalled "${command}"; then
        echo "You don't have ${dependencyName} installed, it is required for this script to execute correctly"
        read -p "Do you want to install it? [Yy/Nn]" -n 1 -r
        echo
        if [[ $REPLY =~ ^[N|n]$ ]]; then
            echo "Exiting from script, cannot proceed without ${dependencyName}"
            exit 1
        fi
        echo "Updating packages version list"
        sudo apt-get update
        echo "Installing ${dependencyName}"
        sudo apt-get install -y "${dependencyName}"
    fi
}

setAndValidateEnvironment() {
    # Environment options
    DOCKER_COMPOSE="docker-compose"
    MINIKUBE="minikube"

    # Default value for environment flag
    environment="docker-compose"

    # Parse flags
    while [[ "$#" -gt 0 ]]; do
        case $1 in
            --environment)
                environment="$2"
                shift 2
                ;;
            *)
                echo "Unknown parameter passed: $1"
                exit 1
                ;;
        esac
    done

    # Validate boolean
    if [[ "${environment}" != "${DOCKER_COMPOSE}" && "${environment}" != "${MINIKUBE}" ]]; then
        echo "Error: --environment must be set to '${DOCKER_COMPOSE}' or '${MINIKUBE}' instead of ${environment}"
        exit 1
    fi
}
