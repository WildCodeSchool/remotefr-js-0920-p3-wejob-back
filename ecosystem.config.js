module.exports = {
  apps: [
    {
      name: 'wcs-wejob-api',
      script: 'index.js',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
