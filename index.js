const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();
const api = require('./routes');

app.use(express.static('public'));
// Should we protect this? for CVs...
app.use(express.static('uploads'));

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

app.listen(port, (err) => {
  if (err) {
    process.exit(1);
  } else {
    console.log(`Express server listening on ${port}`);
  }
});
