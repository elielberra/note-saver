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
        sudo apt update
        echo "Installing ${dependencyName}"
        sudo apt install -y "${dependencyName}"
    fi
}
