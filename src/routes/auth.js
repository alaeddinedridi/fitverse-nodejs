const express = require('express');
const { register,login } = require('../controller/auth');
const router = express.Router();

// Route for login
router.post('/auth/login',login);

// Route for user signup
router.post('/auth/register',register);

module.exports = router;