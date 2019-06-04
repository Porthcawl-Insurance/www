#!/bin/bash

# Assume default credentials but not the current project
gcloud config configurations activate default

GCP_PROJECT=cyberfortress-www
gcloud config set project $GCP_PROJECT

IMAGE_NAME=cf-www
IMAGE_PATH=gcr.io/$GCP_PROJECT/$IMAGE_NAME

# Rebuild site
hugo -D

# Docker
docker build -t ${IMAGE_NAME}:latest .
docker tag ${IMAGE_NAME}:latest ${IMAGE_PATH}:latest
docker push ${IMAGE_PATH}:latest

# Remove dangling images if necessary
# docker rmi $(docker images --filter "dangling=true" -q --no-trunc)

# k8s
gcloud container clusters get-credentials www --region us-central1-a

# Create deployment
# cat << EOF | kubectl apply -f -
# apiVersion: apps/v1
# kind: Deployment
# metadata:
#   name: $IMAGE_NAME
#   labels:
#     app: $IMAGE_NAME
# spec:
#   replicas: 2
#   selector:
#     matchLabels:
#       app: $IMAGE_NAME
#   template:
#     metadata:
#       labels:
#         app: $IMAGE_NAME
#     spec:
#       containers:
#       - name: $IMAGE_NAME
#         image: $IMAGE_PATH
#         ports:
#         - containerPort: 80
# 
# EOF

# Create service
# kubectl expose deployment $IMAGE_NAME --target-port=80 --type=NodePort

# Create ingress ... note the hard-coded "www-static" address - this must exist
# cat << EOF | kubectl apply -f -
# apiVersion: extensions/v1beta1
# kind: Ingress
# metadata:
#   name: ${IMAGE_NAME}-ingress
#   annotations:
#     kubernetes.io/ingress.global-static-ip-name: "www-static"
# spec:
#   backend:
#     serviceName: cf-www
#     servicePort: 80
# 
# EOF

# Scale
kubectl scale --replicas=0 deployment/$IMAGE_NAME
kubectl scale --replicas=2 deployment/$IMAGE_NAME

