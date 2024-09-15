const express = require('express');
const { fetchKey } = require('../controller/paypal');
const router = express.Router();

// Route to get paypal key
router.get('/paypal/key',fetchKey);


module.exports = router;