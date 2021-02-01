const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();
const api = require('./routes');

const adminAppPath = path.resolve(
  __dirname,
  '..',
  'remotefr-js-0920-p3-wejob-admin',
  'build',
);

app.use(express.static('public'));
app.use(express.static(adminAppPath));

app.use(cookieParser());

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONT_URL,
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

app.use('/api', api);

app.get('/*', (req, res) => {
  res.sendFile(
    path.resolve(
      __dirname,
      '..',
      'remotefr-js-0920-p3-wejob-admin',
      'build',
      'index.html',
    ),
  );
});

app.listen(port, (err) => {
  if (err) {
    process.exit(1);
  } else {
    console.log(`Express server listening on ${port}`);
  }
});
