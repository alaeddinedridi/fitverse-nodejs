const express = require('express');
const { register,login, isAuthorized, isTokenExpired } = require('../controller/auth');
const router = express.Router();

// Route for login
router.post('/auth/login',login);

// Route for user signup
router.post('/auth/register',register);
//router.get('/auth/isauthorized', isTokenExpired);

module.exports = router;