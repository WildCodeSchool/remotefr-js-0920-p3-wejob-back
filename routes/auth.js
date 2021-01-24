const express = require('express');

const router = express.Router();

const pool = require('../pool');

const privateKey = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const checkAuthFields = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({
      error: 'E-mail et mot de passe obligatoires.',
    });
  }
  const isEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  if (!email.match(isEmail)) {
    return res.status(422).json({
      error: 'Veuillez vérifier si votre e-mail est bien écrit.',
    });
  }
  return next();
}

// tested: OK
router.post('/register', checkAuthFields, async (req, res) => {
  try {
    const { email, password } = req.body;
    const passwordHashed = await bcrypt.hash(password, 14);
    await pool.query('INSERT INTO user (email, password, isAdmin) VALUES (?, ?, ?)', [email, passwordHashed, 1]);
    const newAdmin = await pool.query(`SELECT id, email FROM user WHERE email=?`, [email]);
    return res.status(201).json(newAdmin[0]);

  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

router.post('/login', checkAuthFields, (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT id, password hash FROM user WHERE BINARY email = BINARY ?';
  pool.query(sql, [email], (err, users) => {
    if (users.length === 0) {
      return res.status(401).json({
        error: 'Cet e-mail n est pas reconnu.'
      });
    }
    const user = users[0];
    // comparer le mdp en clair avec le mdp haché venant de la BDD
    bcrypt.compare(password, user.hash, (errBcrypt, passwordsMatch) => {
      if (errBcrypt) {
        return res.status(500).json({ error: 'Mot de passe non reconnu.' })
      }
      if (!passwordsMatch) {
        return res.status(401).json({
          error: 'Mauvais e-mail et/ou mot de passe.'
        })
      }
      // générer un JWT propre à cet utilisateur (contenant l'id de l'utilisateur)
      jwt.sign({ id: user.id }, privateKey, (errToken, token) => {
        if (errToken) {
          return res.status(500).json({ error: 'impossible de générer le token.' })
        }
        res.cookie('token', token, {
          httpOnly: true
        });
        res.json({ id: user.id })
      })
    })

    if (err) {
      res.status(500).json({
        error: err.message,
      });
    } else {
      res.status(200);
    }

  })
});

module.exports = router;