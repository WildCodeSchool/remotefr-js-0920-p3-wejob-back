const express = require('express');
const jobs = require('./jobs');
const users = require('./users');
const authRouter = require('./auth');

const router = express.Router();

router.use('/metiers', jobs);
router.use('/candidats', users);
router.use('/auth', authRouter);

module.exports = router;
