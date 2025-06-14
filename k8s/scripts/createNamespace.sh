#!/bin/bash

# Create the note-saver namespace only if it doesn't already exist
kubectl get namespace note-saver > /dev/null 2>&1 || kubectl create namespace note-saver
