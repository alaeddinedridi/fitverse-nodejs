const express = require('express');
const { read } = require('../controller/user');
const router = express.Router();

router.get('/users/read',read);


module.exports = router;