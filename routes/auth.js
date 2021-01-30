const express = require('express');
const cors = require('cors');

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

router.post('/login', checkAuthFields, async (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT id, password hash FROM user WHERE BINARY email = BINARY ?';
  try {
    const [users] = await pool.query(sql, [email]); // pool.query() renvoie un tableau [rows, fields] (fields = infos sur les colonnes)
    const [user] = users;
    // pas de user => 401
    if (!user) {
      return res.status(401).json({
        error: 'Cet e-mail n est pas reconnu.'
      });
    }
    // comparer le mdp en clair avec le mdp haché venant de la BDD
    const passwordsMatch = await bcrypt.compare(password, user.hash);
    if (!passwordsMatch) {
      return res.status(401).json({
        error: 'Mauvais e-mail et/ou mot de passe.'
      })
    }
    // générer un JWT propre à cet utilisateur (contenant l'id de l'utilisateur)
    const token = await jwt.sign({ id: user.id }, privateKey);
    res.cookie('token', token, {
      httpOnly: true
    });
    res.json({ id: user.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message,
    });
  }
});


const parseCookie = (cookie) => cookie.split('; ')
  .reduce((carry, kv) => {
    const [k, v] = kv.split('=');
    return { ...carry, [k]: v };
  }, {});

const checkJwtMw = async (req, res, next) => {
  const { cookie } = req.headers;
  const { token } = parseCookie(cookie);
  if (!token) return res.sendStatus(401);
  try {
    const { iat, exp, ...decoded } = await jwt.verify(token, privateKey);
    req.user = decoded;
    return next();
  } catch (err) {
    console.error(err);
    return res.sendStatus(401);
  }
}

router.post('/logout', parseCookie, async (req, res) => {
  try {
    res.cookies.set('token', { expires: Date.now() });
    return res.sendStatus(204);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message,
    });
  }
});

router.get('/check', checkJwtMw, async (req, res) => {
  res.send(req.user);
});

router.get('/info', checkJwtMw, async (req, res) => {
  const [[user]] = await pool.query('SELECT id, email FROM user WHERE id = ?', [req.user.id]);
  res.send(user);
});

module.exports = router;