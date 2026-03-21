module.exports = {
  apps: [
    {
      name: 'stg-backend',
      script: './dist/index.js',
      autorestart: true,
      watch: false,
    },
  ],
};
