module.exports = {
  PORT: 8080,
  DB_CLIENT: 'pg',
  DB_CONNECTION_STRING: process.env.DATABASE_URL,
  KEY: process.env.DIRECTUS_KEY,
  SECRET: process.env.DIRECTUS_SECRET,
  WEBSOCKETS_ENABLED: 'true',
  STORAGE_LOCATIONS: 's3',
  STORAGE_S3_DRIVER: 's3',
  STORAGE_S3_KEY: process.env.STORAGE_S3_KEY,
  STORAGE_S3_SECRET: process.env.STORAGE_S3_SECRET,
  STORAGE_S3_BUCKET: 'stg-v2-staging',
  STORAGE_S3_REGION: 'eu-north-1',
  CORS_ENABLED: true,
  CORS_ORIGIN:
    'array:http://localhost:8055,http://localhost:4000,https://stgv2-web.eu.ngrok.io,https://stg-v2-web-app-staging.vercel.app',
}
