#!/bin/bash

gcloud config configurations activate default

GCP_PROJECT=cyberfortress-sandbox
gcloud config set project $GCP_PROJECT

hugo -D

# Docker
docker build -t cf-www:latest .
docker tag cf-www:latest gcr.io/$GCP_PROJECT/cf-www:latest
docker push gcr.io/$GCP_PROJECT/cf-www:latest
docker rmi $(docker images --filter "dangling=true" -q --no-trunc)

# k8s initial
# kubectl run cf-www --image=gcr.io/$GCP_PROJECT/cf-www --port=80
# kubectl expose deployment cf-www --target-port=80 --type=NodePort
# cat << EOF | kubectl apply -f -
# apiVersion: extensions/v1beta1
# kind: Ingress
# metadata:
#   name: cf-www-ingress
#   annotations:
#     kubernetes.io/ingress.global-static-ip-name: "cf-sandbox"
# spec:
#   backend:
#     serviceName: cf-www
#     servicePort: 80
# 
# EOF

# k8s
kubectl scale --replicas=0 deployment/cf-www
kubectl scale --replicas=1 deployment/cf-www

