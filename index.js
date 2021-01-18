const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();
const api = require('./routes');

app.use(express.json());

app.use('/api', api);

app.listen(port, (err) => {
  if (err) {
    res.status(500).json({
      error: err.message,
    });
  } else {
    console.log(`Express server listening on ${port}`);
  }
});
