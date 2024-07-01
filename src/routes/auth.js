const express = require('express');
const { register,login } = require('../controller/auth');
const router = express.Router();

router.post('/auth/login',login);
router.post('/auth/register',register);

module.exports = router;