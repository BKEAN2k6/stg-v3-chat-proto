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
  ENV=$1
fi

export CONFIG_PATH="./directus.config.$ENV.js"

# NOTE: using json instead of the default yaml, since json is a bit more readable
SNAPSHOT_FILE=./schema-snapshot.json
./node_modules/.bin/directus schema snapshot -y --format json $SNAPSHOT_FILE

# Directus schema snapshot comes out with no linebreaks... Prettify it so it's
# readable and works better with git.
node -e "fs.writeFileSync('$SNAPSHOT_FILE', JSON.stringify(require('$SNAPSHOT_FILE'), null, 2))"