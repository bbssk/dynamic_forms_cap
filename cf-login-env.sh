#!/bin/bash

#copy mta file
#cp mta/mta-playground.yaml mta.yaml

#!/usr/bin/env bash
set -x
set -a

set +x
. ./.deploy.env

cf login -a $CF_API -u $CF_USER -p $CF_PASSWORD -o $CF_ORG -s $CF_SPACE

echo "cf login -a $CF_API -u $CF_USER -p ******** -o $CF_ORG -s $CF_SPACE"

set -x
set +a

unset CF_USER
unset CF_PASSWORD

CF_SPACE=$CF_SPACE;

unset CF_API
unset CF_ORG
unset CF_SPACE
unset CF_REDIRECT_URL

