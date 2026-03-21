# match container_name in docker-compose.yml
DB_CONTAINER_NAME=stg_v2_db

if [ -f ./.env ]; then
  export $(grep -v '^#' ./.env | xargs)
else
  for i in `seq 1 10`;
  do
    echo "Could not load env file! Rename .env-example to .env"
  done
fi