#!/bin/bash
SCRIPT_DIR=$(cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)
cd $SCRIPT_DIR
cd ../../

. ./scripts/_shared.sh

[ ! "$(docker ps -a | grep $DB_CONTAINER_NAME)" ] && echo "db is not running" && exit 1

./scripts/start.sh dev