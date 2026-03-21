# Getting started

## First run

```
yarn install
cp ./.env.example ./.env
./scripts/init.sh
```

This starts up a database, sets it up for Directus and runs the Directus server.

## Subsequent runs (if database is already set up)

```
./scripts/init.sh
```

## Logging in

After running one of the commands above, the Directus server should be running at http://localhost:8055.

The admin user credentials for local development are following:

username: admin@positive.fi  
password: local-admin-pass1


# Development

## Database schema sharing

Directus schema file (`schema-snapshot.json`) defines the relevant table structure for our application and their metadata. If you make changes to the schema you'd like to share, you should run:

```
./scripts/directus_schema_snapshot.sh dev
```

This will override the existing `schema-snapshot.json` and allow you to push those changes to others.

If you want to apply schema changes others have made, you should run

```
./scripts/directus_schema_apply.sh dev
```

NOTE: this rewrites your current schema, so make sure there are no changes that you would like to keep before running this.

## Database data sharing

There are some data within the database that should also be shared between different running instances (including, but not limited to most of the directus_* tables content).

If you make changes to the schema you'd like to share, you should run:

```
yarn seed -o
```

If you want to apply data changes others have made, you should run

```
yarn seed -i
```

NOTE: this rewrites your local data, so make sure there are no changes that you would like to keep before running this.

## Shortcuts for the commands above

From the monorepo root you can run `yarn seed-in` when you receive some schema or data changes you'd like to apply, and `yarn seed-out` if you have some pending schema or data changes you'd like to share.

## Creating new tables to the data model

- In most cases: enable all the "optional system fields" (status, sort, created_on etc.)

## Nice to know

### Stop the database container and remove data

```
docker-compose down
# OR
./scripts/down.sh
```

### Access database logs with

```
docker logs -f stg_v2_db
```
