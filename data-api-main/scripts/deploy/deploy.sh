#!/bin/bash
SCRIPT_DIR=$(cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)
cd $SCRIPT_DIR
cd ../../

if [ -z $FLY_TOKEN ]; then
  echo "missing \$FLY_TOKEN"
  exit 1
fi

# NOTE: flyctl needs to be installed globally (yarn global add flyctl)

if [ -z "$CONFIG_FILE" ]; then
  echo "missing \$CONFIG_FILE"
  exit 1
fi

if [ ! -f "$DOCKERFILE" ]; then
  echo "missing file $DOCKERFILE"
  exit 1
fi

if [ ! -f "$SECRETS_FILE" ]; then
  echo "missing file $SECRETS_FILE"
  exit 1
fi

if [ -z "$APP_NAME" ]; then
  echo "missing \$APP_NAME"
  exit 1
fi

if [ -z "$APP_MEMORY" ]; then
  APP_MEMORY=1024
fi

if [ -z "$APP_VM" ]; then
  APP_VM=shared-cpu-1x
fi

if [ -z "$POSTGRES_VOLUME_SIZE" ]; then
  POSTGRES_VOLUME_SIZE=1
fi

ORGANIZATION=positive-learning-oy
REGION=fra
POSTGRES_NAME=$APP_NAME-db
POSTGRES_SIZE=shared-cpu-1x
POSTGRES_CLUSTERS=1

# Check whether the app is already deployed before.
# If it is, len(PREVIOUS_APP_DEPLOY_EXISTS) > 0.
PREVIOUS_APP_DEPLOY_EXISTS=$(flyctl -t $FLY_TOKEN apps list | grep -E '^$APP_NAME\s+')

# Check whether the database is already deployed before.
# If it is, len(PREVIOUS_DB_DEPLOY_EXISTS) > 0.
PREVIOUS_DB_DEPLOY_EXISTS=$(flyctl -t $FLY_TOKEN apps list | grep -E '^$APP_NAME-db\s+')

if [ -z $PREVIOUS_APP_DEPLOY_EXISTS ] || [ -z $PREVIOUS_DB_DEPLOY_EXISTS ]; then
  if [ -z "$DIRECTUS_SUPER_ADMIN_PASSWORD" ] || [ -z "$DIRECTUS_ADMIN_PASSWORD" ]; then
    echo "\$DIRECTUS_SUPER_ADMIN_PASSWORD and \$DIRECTUS_ADMIN_PASSWORD needed for database seeding"
    exit 1
  fi
fi

# If the config file does not exist, create one to deploy the app
if [ ! -f "$CONFIG_FILE" ] || [ -z $PREVIOUS_DB_DEPLOY_EXISTS ]; then
  echo -e "\n\nLAUNCH\n"
  flyctl -t $FLY_TOKEN launch -o $ORGANIZATION --region $REGION --dockerfile $DOCKERFILE --remote-only --auto-confirm --build-only --name $APP_NAME --no-deploy
  # NOTE: the command above will create fly.toml, which we want to rename, and use that for the further commands
  mv fly.toml $CONFIG_FILE
  echo -e "\n\nSCALE\n"
  flyctl -t $FLY_TOKEN scale -c $CONFIG_FILE --app $APP_NAME vm $APP_VM
  flyctl -t $FLY_TOKEN scale -c $CONFIG_FILE --app $APP_NAME memory $APP_MEMORY
  echo -e "\n\nIMPORT SECRETS\n"
  cat $SECRETS_FILE | flyctl -t $FLY_TOKEN secrets import --config $CONFIG_FILE
fi

# If the database is not deployed, deploy it.
if [ -z $PREVIOUS_DB_DEPLOY_EXISTS ]; then
  echo -e "\n\nCREATE DB\n"
  flyctl -t $FLY_TOKEN postgres create -o $ORGANIZATION --region $REGION --vm-size $POSTGRES_SIZE --name $POSTGRES_NAME --initial-cluster-size $POSTGRES_CLUSTERS --volume-size $POSTGRES_VOLUME_SIZE
fi

# If the database was just created of the app has not yet been deployed, attach the database to the app.
if [ -z $PREVIOUS_APP_DEPLOY_EXISTS ] || [ -z $PREVIOUS_DB_DEPLOY_EXISTS ]; then
  echo -e "\n\nATTACH DB\n"
  flyctl -t $FLY_TOKEN postgres attach $POSTGRES_NAME --app $APP_NAME
fi

echo -e "\n\nDEPLOY\n"
flyctl -t $FLY_TOKEN deploy -c $CONFIG_FILE

# If no previous database deployment existed, seed the database.
if [ -z $PREVIOUS_DB_DEPLOY_EXISTS ]; then
  echo -e "\n\nSEED THE DB\n"
	yarn seed -i --directusUrl https://$APP_NAME.fly.dev --superAdminPass $DIRECTUS_SUPER_ADMIN_PASSWORD
  yarn set-admin-pass --directusUrl https://$APP_NAME.fly.dev --superAdminPass $DIRECTUS_SUPER_ADMIN_PASSWORD --newAdminPass $DIRECTUS_ADMIN_PASSWORD
fi
