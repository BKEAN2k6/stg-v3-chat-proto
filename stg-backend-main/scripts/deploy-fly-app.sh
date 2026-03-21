#/bin/bash

# Requires flyctl to be installed.
# Requires $STG_ENV_NAME to be set.
# Requires $FLY_API_TOKEN to be set.

if [ -z $STG_ENV_NAME ]; then
  echo "provide STG_ENV_NAME"
  exit 1
fi

if [ -z $FLY_ACCESS_TOKEN ]; then
  echo "provide FLY_ACCESS_TOKEN"
  exit 1
fi

flyctl deploy -c fly.${STG_ENV_NAME}.toml --wait-timeout 300
