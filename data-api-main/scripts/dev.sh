#!/bin/bash
SCRIPT_DIR=$(cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)
cd $SCRIPT_DIR
cd ../

. ./scripts/_shared.sh

# simple flip between running for the first time or subsequent runs based on if
# we see the database container.

if [ "$(docker ps -a | grep $DB_CONTAINER_NAME)" ]
then
	./scripts/init/dev_start.sh
else
	./scripts/init/dev_fresh_start.sh
fi