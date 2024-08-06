const express = require('express');
const { create, read } = require('../controller/order');
const {requireSignin, isAuthorized} = require('../controller/auth');
const router = express.Router();

router.post('/order/create',isAuthorized("user"),create);
router.get('/orders/read',isAuthorized("admin"),read);


module.exports = router;