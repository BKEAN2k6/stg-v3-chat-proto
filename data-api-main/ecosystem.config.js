module.exports = {
  apps: [
    {
      name: "directus",
      script: "./node_modules/@directus/api/dist/start.js",
      autorestart: true,
      watch: false,
      env: {
        CONFIG_PATH: "./directus.config.dev.js"
      },
      env_branch: {
        CONFIG_PATH: "./directus.config.branch.js"
      },
      env_staging: {
        CONFIG_PATH: "./directus.config.staging.js"
      },
      env_prod: {
        CONFIG_PATH: "./directus.config.prod.js"
      },
    },
  ],
};
