const express = require('express');
const sendRecruiterData = require('../services/send-recruiter-data');
const router = express.Router();

const pool = require('../pool');

router.post('/', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    res.cookie('recognizeRecruiter', 'true', {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    await sendRecruiterData(name, phone, email);
    const [recruiter] = await pool.query(`SELECT id FROM recruiter WHERE email = ?`, [email]);
    if (recruiter.length === 0) {
      await pool.query(`INSERT INTO recruiter(name, telephone, email) VALUES(?, ?, ?)`, [name, phone, email]);
    }
    return res.sendStatus(201);

  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;