#!/bin/bash

minikube start
flux install
minikube addons enable ingress
