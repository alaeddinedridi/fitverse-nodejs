const express = require('express');
const { create } = require('../controller/order');
const {requireSignin} = require('../controller/auth');
const router = express.Router();

router.post('/order/create',requireSignin,create);


module.exports = router;