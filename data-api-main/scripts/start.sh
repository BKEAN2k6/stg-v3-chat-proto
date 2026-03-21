#!/bin/bash
SCRIPT_DIR=$(cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)
cd $SCRIPT_DIR
cd ../

# This starts a pm2 instance with the given environment (see ecosystem.config.js
# for environment variables related to the environment)

# If an instance is already running that is deleted before running the new one.

if [ -z $1 ]; then
  echo "provide env (dev, staging, prod) as the first parameter"
  exit 1
else
  ENV=$1
fi

./node_modules/.bin/pm2 delete all
./node_modules/.bin/pm2 start --name "directus" --no-daemon --env $1