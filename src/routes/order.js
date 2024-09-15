const express = require('express');
const { create, read } = require('../controller/order');
const {requireSignin, isAuthorized} = require('../controller/auth');
const router = express.Router();

// Route to create an order by user
router.post('/order/create',isAuthorized("user"),create);
// Route to read all orders by admin
router.get('/orders/read',isAuthorized("admin"),read);


module.exports = router;