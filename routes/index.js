const express = require('express');
const candidats = require('./candidats');
const authRouter = require('./auth');

const router = express.Router();

router.use('/candidats', candidats);
router.use('/auth', authRouter);

module.exports = router;
