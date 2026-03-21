# About

The frontend is running the built Vite package through Nginx in a fly.io server.

There is currently only one environment (production), but things have been set up so that creating for example a fully separate staging environment would be quite trivial based on the details and instructions below.

NOTE: basics for the deployment setup are the same as in stg-backend. If something is changed in those, that change should probably be reflected in the stg-backend repository to keep things consistent.

## Initial setup (production)

NOTE: this only needs to be done once. The documentation below is just for reference if it needs to be done again at some point or if new environments need to be created.

Run `FLY_ACCESS_TOKEN=token_here STG_ENV_NAME=production ./scripts/create-fly-app.sh` 

That'll create fly.toml file, that should be renamed to `fly.[STG_ENV_NAME].toml`.

## Deployments

Deployments are handled automatically by a Github action (see .github folder).

Production deployment runs after `npm run lint` and `npm run test` pass when pushing code to the `main` branch.

If needed, deployments can also be manually triggered by running:

`FLY_ACCESS_TOKEN=token_here STG_ENV_NAME=production ./scripts/deploy-fly-app.sh`