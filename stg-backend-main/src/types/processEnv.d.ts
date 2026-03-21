// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace NodeJS {
  export type ProcessEnv = {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: string;
    MONGODB_URI: string;
    REDIS_URI: string;
    MONGO_URL: string; // For jest-mongodb
    SESSION_SECRET: string;
    AWS_S3_BUCKET_NAME: string;
    MAGIC_LINK_SECRET: string;
    DIRECTUS_READ_ONLY_AWS_ACCESS_KEY_ID: string;
    DIRECTUS_READ_ONLY_AWS_SECRET_ACCESS_KEY: string;
    DIRECTUS_READ_ONLY_AWS_REGION: string;
    DIRECTUS_READ_ONLY_AWS_ENDPOINT_URL: string;
    DIRECTUS_READ_ONLY_AWS_BUCKET_NAME: string;
    FRONTEND_URL: string;
    SIDEMAIL_API_KEY: string;
  };
}
