# Deployments

## Directus / data-api (fly.io)

- stg-v2-data-api-branch
- stg-v2-data-api-staging
- stg-v2-data-api-production

### First time set up of the project in fly.io

Fly.io can handle all project configuration through the CLI, so no need to set up things separately on the admin dashboard. The deployment script is set up in a way that if the particular config file for the environment does not exist, it'll go through the project setup first. Otherwise it'll handle only the deployment.

## Next.js / web-app (Vercel)

We have seperate projects for branch, staging and production environments in Vercel. The `branch` environment is used for previews (each push creates a new deployment, which can be previewed).

The projects have the following names:
- stg-v2-web-app-branch
- stg-v2-web-app-staging
- stg-v2-web-app-production

Note that Vercel has a "production" deployment for each project, which can be a bit confusing in our use-case. We only promote the deployments to "production" in stg-v2-production and stg-v2-staging. For branch deployments we use an alias to link individual deployments to specific urls (so for example `stg-v2-branch-abcefg-positive-learning.vercel.app` can be aliased to `stg-v2-branch-stg-214-sound-support.vercel.app`)

### First time set up of the project in Vercel

NOTE: there seems to be no easy way to provide values directly with the CLI, so for this link step, they need to be input manually.

Also note that there's a vercel.json file in monorepo root that provides some required configuration.

```
vercel --build-env SENTRY_AUTH_TOKEN=xyz --regions arn1
# manual input
Set up and deploy: Yes
Scope: Positive Learning
Link to existing: No
Name: stg-v2-branch (or stg-v2-staging or stg-v2-production)
In which directory is your code located: ./
Want to modify these settings: Yes
Change Build Command to: cd apps/next && yarn build
Change Output Directory to: apps/next/.next
```

NOTE: make sure to check the function region from the vercel.com dashboard from the project settings. Change the default from there, since it does not get set when linking (although it seems that it does pick up the region parameter properly for the deployment).

NOTE: `.vercel` folder needs to be removed in between if you want to link multiple projects.

After the linking step is done, further deployments require the VERCEL_ORG_ID and VERCEL_PROJECT_ID environment variables and a token (see secrets). Take note of orgId and projectId from the `./.vercel/project.json` file (not to be committed) and store these for future reference.

# Subsequent deployments

Deployments are handled by GitHub actions. To see the up to date logic for that, see the `.github/workflows/deploy-*.yml` files.

On a very high level, the logic is as follows:

  - deploy data-api
  - replace data-api url in the rewrite at vercel.json
  - deploy web-app

# Manual deployment

It might sometimes be useful to do manual deployments if something isn't working as expected. Generally look at the GitHub workflow to get an understanding on what happens during deployment. Here's a quick overview on how you might get it to work manually.

## Next.js app to Vercel

Make sure you have vercel cli installed locally (yarn global add vercel), then fill in the missing environment variables and run the following from `monorepo` folder.

You also need to temporarily update `vercel.json` to have the proper data-api URL (whatever makes sense in your context).

```
VERCEL_ORG_ID=[secret in keybase] VERCEL_PROJECT_ID=[secret in keybase] vercel deploy -t [create temporary token in Vercel] -S positive-learning --build-env DIRECTUS_URL=https://your-data-api-url.fly.dev --build-env IS_BUILD_TIME=true
```

## data-api to Fly.io

See yml-files in `./github/workflows` to get an understanding about how the data-api is deployed.

TODO: add a more human readable description about manual deployments here similarly to the Vercel deployments above.

# Setting new environment variables to Vercel

You can set new environment variables to Vercel through their dashboard.

# Setting new environment variables to Fly.io

Fly.io doesn't have any UI for setting secrets, so secrets need to be set through the CLI tool (flyctl). We need to do this for staging and production environments at the moment. For branch deployments this is automated through GitHub Actions.

Make sure you have the tool installed and you are properly authenticated, then run the command below against the relevant environment. Note that this will redeploy the application.

```
flyctl secrets set --app stg-staging ENV_VAR1=value1 ENV_VAR2=value2
```

Custom domain can be set by pointing the fly domain to our own domain with a CNAME. Certificate can be then obtained with a command like:

```
flyctl certs create data-api.seethegood.app -a stg-production
```
