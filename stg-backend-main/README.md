# stg-backend

## Local development

### Prerequisites
  * Run `docker-compose up` to run MongoDB, s3rver and redis

### Environment variables
* Rename `.env.sample` to `.env` and fill in any missing variables

### Scripts
* `npm run api-client` - generate rest api client and types
* `npm run dev` - start the server in development mode
* `npm run test` - run tests
* `npm run test:watch` - run tests in watch mode
* `npm run lint` - run xo
* `npm run lint:fix` - run xo with --fix option
* `npm run build` - build the project
* `npm run start` - start the server in production mode
