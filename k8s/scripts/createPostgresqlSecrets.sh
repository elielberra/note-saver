#!/bin/bash

# Load environment variables from .env
source "../db/files/.env"

# Delete the secret if it exists
kubectl delete secret postgresql-passwords --ignore-not-found

# Create the secret using values from the .env file
kubectl create secret generic postgresql-passwords \
  --from-literal=password="$POSTGRES_USER" \
  --from-literal=postgres-password="$POSTGRES_PASSWORD"
