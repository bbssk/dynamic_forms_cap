#!/bin/bash

#copy mta file
#cp mta/mta-playground.yaml mta.yaml

#!/usr/bin/env bash
set -x
set -a

set +x
source .deploy.env
set -x
set +a

cf target -o $CF_ORG -s $CF_SPACE

unset CF_USER
unset CF_PASSWORD

CF_SPACE=$CF_SPACE;

#build
set -x
mbt build -t gen --mtar mta.tar    
cf deploy gen/mta.tar -f --delete-services

unset CF_API
unset CF_ORG
unset CF_SPACE
unset CF_REDIRECT_URL

