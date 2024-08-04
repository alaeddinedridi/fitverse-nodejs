const express = require('express');
const { create,fetch,read, add, readByCategory,deleteById } = require('../controller/product');
const router = express.Router();
const uploadMiddleware = require('../controller/uploadMiddleware');
const fs = require('fs');
const {isAuthorized} = require('../controller/auth');

router.get('/product/create',create);
router.delete('/product/delete/:id',deleteById);
router.get('/product/:id',fetch);
router.get('/products/read',read)
router.get('/products/readbycategory/:category',readByCategory)
router.post('/product/add',add);
router.post('/product/upload',isAuthorized("admin"), uploadMiddleware)

module.exports = router;