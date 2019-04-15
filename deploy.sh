#!/bin/bash

gcloud config configurations activate default
gcloud config set project cyberfortress-www-sandbox

hugo -D
gcloud -q app deploy
