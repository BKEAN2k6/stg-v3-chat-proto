#!/bin/bash
SCRIPT_DIR=$(cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)
cd $SCRIPT_DIR
cd ../../

if [ -z $1 ]; then
  echo "provide env (dev, staging, prod) as the first parameter"
  exit 1
else
  ENV_ID=$1
fi

echo "setting up: $ENV_ID"

# 1. bootstrap directus (only the very first start, when database is new)
export ADMIN_EMAIL=$DIRECTUS_SUPER_ADMIN_EMAIL
export ADMIN_PASSWORD=$DIRECTUS_SUPER_ADMIN_PASSWORD
echo "bootstrap..."
./scripts/directus_bootstrap.sh $ENV_ID
[ $? -ne 0 ] && echo "failed to bootstrap" && exit 1
echo "bootstrap done!"

# 2. apply schema
echo "apply schema..."
./scripts/directus_schema_apply.sh $ENV_ID
[ $? -ne 0 ] && echo "failed to apply schema" && exit 1
echo "schema applied!"

# 3. start directus
echo "start directus..."
./scripts/start.sh $ENV_ID &

# 4. Seed the database if we're on a feature branch
if [ "$1" = "branch" ]; then
  echo "seeding database..."
  yarn seed -i --directusUrl https://$APP_NAME.fly.dev --superAdminPass $DIRECTUS_SUPER_ADMIN_PASSWORD
  yarn set-admin-pass --directusUrl https://$APP_NAME.fly.dev --superAdminPass $DIRECTUS_SUPER_ADMIN_PASSWORD --newAdminPass $DIRECTUS_ADMIN_PASSWORD
fi

sleep infinity
