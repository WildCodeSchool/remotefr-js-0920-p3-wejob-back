const express = require('express');
const jwt = require('jsonwebtoken');
const sendRecruiterData = require('../services/send-recruiter-data');
const pool = require('../pool');
const { checkIsAdmin, extractJwtRecruiter } = require('../middlewares/auth');

const router = express.Router();

const RECRUITER_COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 7;

router.post('/', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const token = await jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '1w',
    });
    res.cookie('recruiter', token, {
      maxAge: RECRUITER_COOKIE_MAX_AGE,
    });
    await sendRecruiterData(name, phone, email);
    const [
      recruiter,
    ] = await pool.query(`SELECT id, visits FROM recruiter WHERE email = ?`, [
      email,
    ]);
    if (recruiter.length === 0) {
      const visits = JSON.stringify([Date.now()]);
      await pool.query(
        `INSERT INTO recruiter(name, telephone, email, visits) VALUES(?, ?, ?, ?)`,
        [name, phone, email, visits],
      );
      return res.sendStatus(201);
    }
    const { visits: previousVisits } = recruiter[0];
    const visits = previousVisits
      ? JSON.stringify([Date.now(), ...previousVisits])
      : JSON.stringify([Date.now()]);
    await pool.query('UPDATE recruiter SET visits = ? WHERE email = ?', [
      visits,
      email,
    ]);
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

router.get('/', checkIsAdmin, async (req, res) => {
  try {
    const [recruiters] = await pool.query(
      'SELECT id, name, email, telephone, visits FROM recruiter',
    );
    return res.json(recruiters);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

router.get('/check', async (req, res) => {
  try {
    const recruiter = await extractJwtRecruiter(req);
    if (!recruiter) throw new Error('Invalid recruiter JWT');
    return res.json({
      status: true,
    });
  } catch (err) {
    res.clearCookie('recruiter');
    return res.json({ status: false });
  }
});

module.exports = router;
