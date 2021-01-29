const express = require('express');

const router = express.Router();

const pool = require('../pool');

router.put('/:id', async (req, res) => {
  try {
    const candidatToUpdateId = req.params.id;
    await pool.query(`UPDATE user LEFT JOIN user_fiche ON user.id=user_fiche.user_id SET user.email=?, user.password=? WHERE user_fiche.id=?`, [req.body.email, req.body.password, candidatToUpdateId]);
    // id reference id (in url) is user.id, take this line below :
    // await pool.query(`UPDATE user SET email=?, password=? WHERE id=?`, [req.body.email, req.body.password, candidatToUpdateId]);
    const updatedCandidat = {
      email: req.body.email,
      id: candidatToUpdateId
    };
    return res.status(204).json(updatedCandidat);

  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;