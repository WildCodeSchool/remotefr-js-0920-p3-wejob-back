const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { adminAppBuildDir, isProd, isTest } = require('./config');
const api = require('./routes');

const app = express();
const logFormat = isProd ? 'combined' : 'dev';

if (!isTest) app.use(morgan(logFormat));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
app.use(express.static('uploads'));
if (adminAppBuildDir) app.use(express.static(adminAppBuildDir));

app.use(
  cors({
    origin: [process.env.ADMIN_APP_URL, process.env.PUBLIC_APP_ORIGIN],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

app.use('/api', api);

// Serves the admin app from its build dir
if (adminAppBuildDir) {
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(adminAppBuildDir, 'index.html'));
  });
}

module.exports = app;
