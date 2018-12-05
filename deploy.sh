#!/bin/bash

gcloud config configurations activate default
gcloud config set project cyberfortress-www

gcloud -q app deploy
