#/bin/bash

# NOTE: if this is ran again after we've already created a deployment for a
# specific environment, Fly will add a random suffix to the name of the newly
# generated app (like stg-backed-production-icy-sky-123). This can be helpful
# when testing things, but remember to manually remove the created app when
# done.

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

flyctl launch \
  --name stg-backend-${STG_ENV_NAME} \
  -o positive-learning-oy \
  --region arn \
  --dockerfile Dockerfile.prod \
  --remote-only --auto-confirm --build-only
