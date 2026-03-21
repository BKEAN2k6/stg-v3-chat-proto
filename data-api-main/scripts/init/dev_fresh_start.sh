#!/bin/bash
SCRIPT_DIR=$(cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)
cd $SCRIPT_DIR
cd ../../

. ./scripts/_shared.sh

[ "$(docker ps -a | grep $DB_CONTAINER_NAME)" ] && echo "db already running" && exit 1

# start database and wait for it to be up
docker-compose up -d

until echo $(docker exec $DB_CONTAINER_NAME pg_isready) | grep "accepting connections" -q ; do 
  sleep 2 
  echo "waiting for postgres to start..." 
done
sleep 1
echo "postgres started!"

# first run, so boostrap the database ...
ADMIN_EMAIL=superadmin@positive.fi ADMIN_PASSWORD=local-superadmin-pass1 \
  ./scripts/directus_bootstrap.sh dev

# ... and apply our schema ...
./scripts/directus_schema_apply.sh dev

# ... and seed the database with our data (this needs the server to be up, so
# it's set to run on the background and it can handle retry, since the first run
# might fail)
[ ! $SKIP_SEEDING ] && yarn seed -i --superAdminPass "local-superadmin-pass1" --newAdminPass "local-admin-pass1" &

./scripts/start.sh dev