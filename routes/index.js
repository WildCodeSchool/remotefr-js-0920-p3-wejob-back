const express = require('express');
const candidats = require('./candidats');
const authRouter = require('./auth');
const user = require('./user');

const router = express.Router();

router.use('/candidats', candidats);
router.use('/auth', authRouter);
router.use('/user', user);

module.exports = router;
