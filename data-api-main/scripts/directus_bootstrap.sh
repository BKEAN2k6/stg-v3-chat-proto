#!/bin/bash
SCRIPT_DIR=$(cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)
cd $SCRIPT_DIR
cd ../

# NOTE: all directus*.sh files have this same structure, since we need to set
# the CONFIG_PATH before any command (because we want different config per
# environment).

if [ -z $1 ]; then
  echo "provide env (dev, staging, prod) as the first parameter"
  exit 1
else
  ENV_ID=$1
fi

export CONFIG_PATH="./directus.config.$ENV_ID.js"
./node_modules/.bin/directus bootstrap