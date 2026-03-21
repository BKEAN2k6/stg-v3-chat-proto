namespace NodeJS {
  export type ProcessEnv = {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: string;
    MONGODB_URI: string;
    REDIS_URL: string;
    REDISCLOUD_URL: string;
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
    BACKEND_URL: string;
    SIDEMAIL_API_KEY: string;
    UMAMI_HOST: string;
    OPENAI_API_KEY: string;
    ELEVENLABS_API_KEY: string;
    CALLBACK_SECRET: string;
    SKIP_MONGO_SETUP?: 'true';
  };
}
