# About

The stack running in the cloud needs a MongoDB instance, a Redis instance, an S3 bucket and the Node app (backend) itself (this repository right here).

There is currently only one environment (production), but things have been set up so that creating for example a fully separate staging environment would be quite trivial based on the details and instructions below.

# MongoDB

MongoDB is running in Atlas (https://cloud.mongodb.com).

Note that IP specific access has been disabled in the network access settings (since it isn't trivial to get a static IP that all requests come from, see for example: https://community.fly.io/t/request-fly-ip-ranges/127/22 or https://community.fly.io/t/outbound-ip-address/1366/8)

The connection string was assigned to an environment variable on the main app after it was created like this:

```
export FLY_ACCESS_TOKEN=token_here
export STG_ENV_NAME=production
./scripts/set-fly-app-secret.sh MONGODB_URI "mongodb+srv://admin:pass@cluster0.xyz.mongodb.net/production?retryWrites=true&w=majority"
```

# Redis

Redis was initially set up with:

```
FLY_ACCESS_TOKEN=token_here flyctl redis create \
  -o positive-learning-oy \
  --name stg-backend-production-redis \
  --region arn \
  --enable-eviction \
  --replica-regions ams
```

The connection string was assigned to an environment variable on the main app after it was created like this:

```
export FLY_ACCESS_TOKEN=token_here
export STG_ENV_NAME=production
./scripts/set-fly-app-secret.sh REDIS_URI "redis://user:pass@fly-stg-backend-production-redis.upstash.io:6379"
```

# S3 bucket

The required S3 bucket is configured directly from the Amazon Web Services dashboard. See separate instructions for creating those in `s3-buckets.md`

# Backend

The backend is running in Fly.io (https://fly.io).

## Initial setup (production)

NOTE: this only needs to be done once. The documentation below is just for reference if it needs to be done again at some point or if new environments need to be created.

Run `FLY_ACCESS_TOKEN=token_here STG_ENV_NAME=production ./scripts/create-fly-app.sh` 

That'll create fly.toml file, that should be renamed to `fly.[STG_ENV_NAME].toml`.

Secrets should be "staged" at this point so that the first deployment will work correctly. You can add the secrets in the environment file one by one using the `./scripts/set-fly-app-secret.sh` script. See example below:

```
export FLY_ACCESS_TOKEN=token_here
export STG_ENV_NAME=production
./scripts/set-fly-app-secret.sh MONGODB_URI "mongodb+srv://admin:pass@cluster0.xyz.mongodb.net/production?retryWrites=true&w=majority"
./scripts/set-fly-app-secret.sh REDIS_URI "redis://user:pass@fly-stg-backend-production-redis.upstash.io:6379"
./scripts/set-fly-app-secret.sh PORT 80
./scripts/set-fly-app-secret.sh AWS_ACCESS_KEY_ID access_key_here
./scripts/set-fly-app-secret.sh AWS_SECRET_ACCESS_KEY secret_access_key_here
./scripts/set-fly-app-secret.sh AWS_REGION eu-north-1
./scripts/set-fly-app-secret.sh AWS_ENDPOINT_URL https://s3.eu-north-1.amazonaws.com
./scripts/set-fly-app-secret.sh AWS_S3_BUCKET_NAME stg-backend-production
./scripts/set-fly-app-secret.sh MAGIC_LINK_SECRET secret
./scripts/set-fly-app-secret.sh SESSION_SECRET secret
```

## Environment variables (secrets)

New environment variables can be added to a specific environments deployment using the `./scripts/set-fly-app-secret.sh` script (see examples above). Note that a new deployment will be created whenever this is called after the first deployment has been made (this is how the `fly secrets` command works, and there doesn't appear to be a way to override that behaviour).

## Deployments

Deployments are handled automatically by a Github action (see .github folder).

Production deployment runs after `npm run lint` and `npm run test` pass when pushing code to the `main` branch.

If needed, deployments can also be manually triggered by running:

`FLY_ACCESS_TOKEN=token_here STG_ENV_NAME=production ./scripts/deploy-fly-app.sh`