const express = require('express');
const sendRecruiterData = require('../services/send-recruiter-data');
const pool = require('../pool');
const { checkIsAdmin } = require('../middlewares/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    res.cookie('recognizeRecruiter', 'true', {
      maxAge: 1000 * 60 * 60 * 24 * 7,
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
      ? JSON.stringify([...previousVisits, Date.now()])
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

router.get('/check', (req, res) => {
  res.json({
    status: !!req.cookies.recognizeRecruiter,
  });
});

module.exports = router;
