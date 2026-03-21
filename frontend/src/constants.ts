/* eslint-disable @typescript-eslint/naming-convention */
const isProduction = import.meta.env.MODE === 'production';

const constants = {
  FILE_HOST: isProduction
    ? (import.meta.env.VITE_FILE_HOST as string)
    : '/stg-backend-development/',
  ANALYTICS_ID: import.meta.env.VITE_UMAMI_WEBSITE_ID as string,
  MAX_FILE_SIZE_IN_BYTES: 30_000_000,
  COOKIE_DOMAIN: isProduction ? '.seethegood.app' : 'localhost',
};

export default constants;
