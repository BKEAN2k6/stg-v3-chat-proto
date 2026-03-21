module.exports = {
  HOST: 'localhost',
  DB_CLIENT: 'pg',
  DB_CONNECTION_STRING: 'postgres://stg_v2_user:stg_v2_pass@127.0.0.1:5433/stg_v2?sslmode=disable', // prettier-ignore
  KEY: 'b9c9b9d3-ce84-4c66-a0b8-5fa00ef547b0',
  SECRET: 'hLOSmC2-XQdDCOBTU9DPCt_u3EXxmHbx',
  WEBSOCKETS_ENABLED: 'true',
  STORAGE_LOCATIONS: 'local,s3',
  STORAGE_S3_DRIVER: 's3',
  STORAGE_S3_KEY: process.env.STORAGE_S3_KEY,
  STORAGE_S3_SECRET: process.env.STORAGE_S3_SECRET,
  STORAGE_S3_BUCKET: 'stg-v2-development',
  STORAGE_S3_REGION: 'eu-north-1',
  CORS_ENABLED: true,
  CORS_ORIGIN:
    'array:http://localhost:8055,http://localhost:3000,http://localhost:4000,https://stgv2-web.eu.ngrok.io,https://stgweb.vercel.app',
  // NOTE: useful for debugging
  // LOG_LEVEL: 'trace',
  // LOG_STYLE: 'raw',
  // NOTE: this needs to be set for oauth stuff to work properly
  PUBLIC_URL: 'http://localhost:8055',
  AUTH_PROVIDERS: 'skolon',
  AUTH_SKOLON_DRIVER: 'oauth2',
  AUTH_SKOLON_SCOPE: 'authenticatedUser.profile.read',
  AUTH_SKOLON_CLIENT_ID: 'REPLACE_WITH_SKOLON_CLIENT_ID_FOR_TESTING',
  AUTH_SKOLON_CLIENT_SECRET: 'REPLACE_WITH_SKOLON_CLIENT_SECRET_FOR_TESTING',
  AUTH_SKOLON_AUTHORIZE_URL: 'https://idp.skolon.com/oauth/auth',
  AUTH_SKOLON_ACCESS_URL: 'https://idp.skolon.com/oauth/access_token',
  // NOTE: this is the public url of the app running from stgweb repo
  AUTH_SKOLON_PROFILE_URL: 'http://localhost:3000/auth/oauth/skolon/userinfo',
  AUTH_SKOLON_IDENTIFIER_KEY: 'skolon_uuid',
  AUTH_SKOLON_CLIENT_TOKEN_ENDPOINT_AUTH_METHOD: 'client_secret_post',
  // see https://docs.directus.io/self-hosted/sso.html
  // NOTE: this won't work since ngrok.io is on the publicsuffix.org list! But for production, we need to set it up as .seethegood.app
  // REFRESH_TOKEN_COOKIE_DOMAIN: '.ngrok.io',
  // REFRESH_TOKEN_COOKIE_SECURE: 'true',
  // REFRESH_TOKEN_COOKIE_SAME_SITE: 'None',
  // NOTE: only for development!
  REFRESH_TOKEN_COOKIE_SECURE: 'false',
  REFRESH_TOKEN_COOKIE_SAME_SITE: 'lax',
  // NOTE ALSO: msRefreshBeforeExpires: 30000 if using Directus SDK with autoRefresh enabled (the default)
  ACCESS_TOKEN_TTL: '5m',
  // ACCESS_TOKEN_TTL: '10s',
  // After this expires, user will be logged out
  // REFRESH_TOKEN_TTL: '7d',
  // WEBSOCKETS_HEARTBEAT_PERIOD: 3,
}
