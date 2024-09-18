#!/bin/bash -e

verifyAndInstallDependency() {
    command=$1
    dependencyName=$2
    if ! command -v "${command}" &> /dev/null; then
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