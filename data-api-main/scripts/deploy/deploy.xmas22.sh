#!/bin/bash
CONFIG_FILE=fly.xmas22.toml DOCKERFILE=Dockerfile.xmas22 SECRETS_FILE=../../deploy-secrets/xmas22-data-api-secrets APP_NAME=stg-xmas22 APP_MEMORY=4096 APP_VM=dedicated-cpu-2x POSTGRES_VOLUME_SIZE=10 ./deploy.sh
