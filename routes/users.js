const express = require('express');

const router = express.Router();

const pool = require('../pool');

const urlApiUsers = '/api/candidats/';

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

router.get('/:id', (req, res) => {
  pool.query('SELECT * FROM user WHERE id=?', req.params.id, (err, results) => {
    if (err) {
      res.status(500).json({
        error: err.message,
      });
    } else {
      res.json(results);
    }
  });
});

router.put('/:id', (req, res) => {
  pool.query(`
  UPDATE user SET ? 
  WHERE id=?
  `, [req.body, req.params.id], (err) => {
    if (err) {
      res.status(500).json({
        error: err.message,
      });
    }
    return pool.query('SELECT * FROM user WHERE id = ?', req.params.id, (err2, results) => {
      if (err2) {
        return res.status(500).json({
          error: err2.message,
          sql: err2.sql,
        });
      }
      const modifiedUser = results[0];
      const host = req.get('host');
      const location = `http://${host}${urlApiUsers}${modifiedUser.id}`;
      return res
        .status(201)
        .set('Location', location)
        .json(modifiedUser);
    });
  });
});

router.post('/', (req, res) => {
  pool.query('INSERT INTO user SET ?', [req.body], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    return pool.query('SELECT * FROM user WHERE id = ?', results.insertId, (err2, results2) => {
      if (err2) {
        return res.status(500).json({
          error: err2.message,
          sql: err2.sql,
        });
      }
      const host = req.get('host');
      const location = `http://${host}${urlApiUsers}${results.insertId}`;
      return res
        .status(201)
        .set('Location', location)
        .json(results2);
    });
  });
});

router.delete('/:id', (req, res) => {
  pool.query('DELETE FROM user WHERE id=?', req.params.id, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    return res.sendStatus(204);
  });
});

module.exports = router;