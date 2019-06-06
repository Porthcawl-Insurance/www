#!/bin/bash

# Assume default credentials but not the current project
gcloud config configurations activate default

GCP_PROJECT=cyberfortress-www
gcloud config set project $GCP_PROJECT

# Tag
if [[ $(git branch | grep \* | cut -d ' ' -f2) == "master" ]]; then
TAG=latest
else
TAG=sandbox
fi

IMAGE_NAME=cf-www
IMAGE_PATH=gcr.io/$GCP_PROJECT/$IMAGE_NAME:$TAG

DEPLOYMENT_NAME=${IMAGE_NAME}-${TAG}

# Rebuild site
hugo -D

# Docker
docker build -t ${IMAGE_NAME}:${TAG} .
docker tag ${IMAGE_NAME}:${TAG} $IMAGE_PATH
docker push ${IMAGE_PATH}

# Remove dangling images if necessary
# docker rmi $(docker images --filter "dangling=true" -q --no-trunc)

# k8s
gcloud container clusters get-credentials www --region us-central1-a

# Create deployment
cat << EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: $DEPLOYMENT_NAME
  labels:
    app: $DEPLOYMENT_NAME
spec:
  replicas: 2
  selector:
    matchLabels:
      app: $DEPLOYMENT_NAME
  template:
    metadata:
      labels:
        app: $DEPLOYMENT_NAME
    spec:
      containers:
      - name: $DEPLOYMENT_NAME
        image: $IMAGE_PATH
        imagePullPolicy: Always
        ports:
        - containerPort: 80

EOF

# Create service
# kubectl expose deployment $DEPLOYMENT_NAME --target-port=80 --type=NodePort

# Create ingress ... note the hard-coded "www-X" address - this must exist
# cat << EOF | kubectl apply -f -
# apiVersion: extensions/v1beta1
# kind: Ingress
# metadata:
#   name: ${DEPLOYMENT_NAME}-ingress
#   annotations:
#     kubernetes.io/ingress.global-static-ip-name: "www-sandbox"
# spec:
#   backend:
#     serviceName: $DEPLOYMENT_NAME
#     servicePort: 80
# 
# EOF

# Scale
kubectl scale --replicas=0 deployment/$DEPLOYMENT_NAME
kubectl scale --replicas=2 deployment/$DEPLOYMENT_NAME

