const path = require('path');
const dotenv = require('dotenv');

const isTest = process.env.NODE_ENV === 'test';
const envFile = isTest ? '.env.test' : '.env';

dotenv.config({
  path: path.join(__dirname, envFile),
});

const adminAppBuildDir =
  process.env.ADMIN_APP_DIR &&
  path.resolve(__dirname, process.env.ADMIN_APP_DIR, 'build');

module.exports = {
  adminAppBuildDir,
  port: process.env.PORT || 5000,
  isProd: process.env.NODE_ENV === 'production',
  isTest,
};
