# TODO: Integrate this code snippet with other bash scripts

#!/bin/bash

# Default values
isCertForMinikube="false"

# Parse flags
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --isCertForMinikube)
      isCertForMinikube="$2"
      shift 2
      ;;
    *)
      echo "Unknown parameter passed: $1"
      exit 1
      ;;
  esac
done

# Validate boolean
if [[ "$isCertForMinikube" != "true" && "$isCertForMinikube" != "false" ]]; then
  echo "Error: --isCertForMinikube must be 'true' or 'false'"
  exit 1
fi

# Set sslCertsDir based on isCertForMinikube
if [[ "$isCertForMinikube" == "true" ]]; then
  sslCertsDir="k8s/ssl-certs"
else
  sslCertsDir="ssl-certs"
fi

# Output
echo "isCertForMinikube: $isCertForMinikube"
echo "sslCertsDir: $sslCertsDir"
