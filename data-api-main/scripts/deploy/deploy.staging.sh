#!/bin/bash
CONFIG_FILE=fly.staging.toml DOCKERFILE=Dockerfile.staging SECRETS_FILE=../../deploy-secrets/staging-data-api-secrets APP_NAME=stg-staging APP_MEMORY=1024 APP_VM=shared-cpu-1x POSTGRES_VOLUME_SIZE=1 ./deploy.sh
