const express = require('express');
const { create } = require('../controller/order');
const {requireSignin, isAuthorized} = require('../controller/auth');
const router = express.Router();

router.post('/order/create',isAuthorized("user"),create);


module.exports = router;