const express = require('express');
const { fetchKey } = require('../controller/paypal');
const router = express.Router();

router.get('/paypal/key',fetchKey);


module.exports = router;