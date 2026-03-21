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

if [ -z $1 ]; then
  echo "provide secret name as the first parameter"
  exit 1
else
  SECRET_NAME=$1
fi

if [ -z $2 ]; then
  echo "provide secret value as the second parameter"
  exit 1
else
  SECRET_VALUE=$2
fi

fly secrets -c fly.${STG_ENV_NAME}.toml set ${SECRET_NAME}=${SECRET_VALUE}
