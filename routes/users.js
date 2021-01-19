const express = require('express');

const router = express.Router();

const pool = require('../pool');

router.get('/', (req, res) => {
  pool.query('SELECT * FROM user', (err, results) => {
    if (err) {
      res.status(500).json({
        error: err.message,
      });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;