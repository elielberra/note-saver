#!/bin/bash

minikube start
minikube addons enable ingress
flux install
