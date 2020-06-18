#!/bin/bash

# PV
kubectl create -f local-storageclass.yml
kubectl create -f persistent-volume-def.yml

# CONFIG MAPS & SECRET
kubectl create -f myapp-secret.yml
kubectl create -f postgres-configMap.yml

# REDIS
kubectl create -f redis-deployment.yml
kubectl create -f redis-service-clusterip.yml

# POSTGRES
kubectl create -f postgres-deployment.yml
kubectl create -f postgres-service-clusterip.yml

# BACKEND
kubectl create -f mybackend-deployment.yml
kubectl create -f service-nodeport.yml

