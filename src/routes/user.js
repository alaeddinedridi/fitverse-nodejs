const express = require('express');
const { read } = require('../controller/user');
const router = express.Router();
const {isAuthorized} = require('../controller/auth');


router.get('/users/read',isAuthorized("admin"),read);


module.exports = router;