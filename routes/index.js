const express = require('express');
const jobs = require('./jobs');
const users = require('./users');

const router = express.Router();

router.use('/metiers', jobs);
router.use('/candidats', users);

module.exports = router;
