/* eslint-disable @typescript-eslint/naming-convention */
const isProduction = import.meta.env.MODE === 'production';

const constants = {
  FILE_HOST: isProduction
    ? 'https://stg-backend-production.s3.eu-north-1.amazonaws.com/'
    : '/stg-backend-development/',
  MAX_FILE_SIZE_IN_BYTES: 30_000_000, // 30mb
  COOKIE_DOMAIN: isProduction ? '.seethegood.app' : 'localhost',
};

export default constants;
