const express = require('express');
const { create,fetch,read, add, readByCategory,deleteById, update } = require('../controller/product');
const router = express.Router();
const uploadMiddleware = require('../controller/uploadMiddleware');
const fs = require('fs');
const {isAuthorized} = require('../controller/auth');

// Route to insert products from a file
router.get('/product/create',create);
// Route to delete a product by admin
router.delete('/product/delete/:id',isAuthorized("admin"),deleteById);
// Route to read a product
router.get('/product/:id',fetch);
// Route to delete all products
router.get('/products/read',read)
// Route to read products which belong to a specific category
router.get('/products/readbycategory/:category',readByCategory)
// Route to upload a new product by admin
router.post('/product/upload',isAuthorized("admin"), uploadMiddleware)
// Route to update a specific product by admin
router.put('/product/update/:id',isAuthorized("admin"),update)

module.exports = router;