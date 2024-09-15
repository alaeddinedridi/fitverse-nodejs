const express = require('express');
const { read } = require('../controller/user');
const router = express.Router();
const {isAuthorized} = require('../controller/auth');

// Route to read all users by admin
router.get('/users/read',isAuthorized("admin"),read);


module.exports = router;