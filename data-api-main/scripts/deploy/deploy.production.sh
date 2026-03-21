#!/bin/bash
CONFIG_FILE=fly.production.toml DOCKERFILE=Dockerfile.prod SECRETS_FILE=../../deploy-secrets/production-data-api-secrets APP_NAME=stg-production APP_MEMORY=4096 APP_VM=dedicated-cpu-2x POSTGRES_VOLUME_SIZE=10 ./deploy.sh
