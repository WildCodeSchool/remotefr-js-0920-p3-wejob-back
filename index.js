const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();
const api = require('./routes');

const adminAppBuildDir =
  process.env.ADMIN_APP_DIR &&
  path.resolve(__dirname, process.env.ADMIN_APP_DIR, 'build');

app.use(express.static('public'));
if (adminAppBuildDir) app.use(express.static(adminAppBuildDir));
app.use(cookieParser());
app.use(express.json());

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

app.listen(port, (err) => {
  if (err) {
    process.exit(1);
  } else {
    console.log(`Express server listening on ${port}`);
  }
});
