const express = require('express');
const bcrypt = require('./bcrypt.js');

const router = express.Router();

router.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({
      error: 'E-mail et mot de passe obligatoires.',
    });
  }

  bcrypt.hash(password, 14, (errHash, hash) => {
    if (errHash) {
      return res.status(500).json({
        error: 'Une erreur est apparue avec votre mot de passe.',
      });
    }
    pool.query('INSERT INTO user SET (?,?)', [{ email: req.body.email, password: hash }], (errInsert, status) => {
      if (errInsert) {
        if (errInsert.code === 'ER_DUP_ENTRY') {
          return res.status.json({
            error: 'Compte déjà existant avec cette adresse e-mail.'
          });
        }
        return res.status(500).json({
          error: 'Impossible de créer le compte.',
        });
      };
      return res.status(201).json({
        id: status.insertId
      });
    });
  });
});

router.post('/login', (req, res) => {
  if (err) {
    res.status(500).json({
      error: err.message,
    });
  } else {
    res.status(200);
  }
});

module.exports = router;