const Product = require("../models/product");
const products=require('../products');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Read one product from database
exports.fetch=(req,res)=>{
  
  Product.findOne({ _id: req.params.id }).exec((err, product) => {
    if (product){
      res.json(product)
    }
    if (err){
      res.json({ err });
    }
    
  })
}

// Configure multer storage and file name so we can later use it to upload pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create multer upload instance
const upload = multer({ storage: storage });


// Update a product
exports.update=(req,res)=>{
  
  // Allow the upload of 5 pictures
  upload.array('files', 5)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    

    // Retrieve uploaded files
    const {name, category, brand, price, stock, description} = req.body
    console.log("this is category: "+category)
    const files = req.files;

    const errors = [];
    let images
    let data={}
    console.log("under update product")

    // Get the product to update from database
    Product.findOne({ _id: req.params.id }).exec((err, product) => {
      if (product){
        console.log("found the product")
        // if there are pictures to be uploaded
        if (typeof req.files != "undefined"){
          console.log("there are files to update")
          // Get the pictures one by one 
          files.forEach((file) => {
            // supported picture extensions
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            // max size of a picture
            const maxSize = 5 * 1024 * 1024; // 5MB
            
            // check if the picture has a valid extension
            if (!allowedTypes.includes(file.mimetype)) {
              errors.push(`Invalid file type: ${file.originalname}`);
            }
            
            // Check if the filesize is allowed
            if (file.size > maxSize) {
              errors.push(`File too large: ${file.originalname}`);
            }
          });

          // Get pictures names
          images = files.map(file => file.filename)
          console.log("files:"+images)

          if (errors.length > 0) {
            // if there an error then remove uploaded files
            files.forEach((file) => {
              fs.unlinkSync(file.path);
            });
      
            return res.status(400).json({ errors });
          }

          // prepare data to be stored in database in case there are pictures to be uploaded
          data = {name, category, brand, price, stock, description, images}

        }else{
          // prepare data to be stored in database in case there are NO pictures to be uploaded
          console.log("not going to update files")
          data = {name, category, brand, price, stock, description}
        }

        // Update the product informations with the new changes in the database
        product.updateOne(data,function (err, success) {
          if (err) {
            console.log(err);
            return res.status(400).json({ error: "error" });
          } else {
            if (typeof req.files != "undefined"){
              // Upload all pictures
              files.forEach((file) => {
                const filePath = `uploads/${file.filename}`;
                fs.rename(file.path, filePath, (err) => {
                  if (err) {
                    // Handle error appropriately and send an error response
                    return res.status(500).json({ error: 'Failed to store the file' });
                  }
                });
              });
            }
            console.log({
              name, category, brand, price, stock, description
            });
            console.log("edited");
          }
          res.json(product)
        })
      }
      if (err){
        res.json({ err });
      }
    })

  })      
}

// Read all products
exports.read =(req,res)=>{
  Product.find({}).exec(function (err, products) {
    console.log("inside read products")
    if (err) {
      res.json({ err });
    }

    if (products){
      console.log("those are products:"+products)
      res.status(200).json(products)
    }
    
  })
}

// Delete product from database using it's id
exports.deleteById= (req,res)=>{
  Product.findOneAndRemove({ _id: req.params.id }, (err, product) => {
    if (err) {
      res.json({ err });
    }
    // return success response
    if (product){
      res.status(200).json({ message: "found and removed the product"})
    }
    
  })
}

// Read products which belong to a category: men, women ..
exports.readByCategory =(req,res)=>{
  Product.find({}).exec(function (err, products) {
    products= products.filter(product => product.category==req.params.category)
    res.send(products)
  })
}




// Insert products from a file to database
exports.create = (req, res) => {

  Product.insertMany(products).then(function(){
    res.send("Data inserted")  // Success
  }).catch(function(error){
      res.send(error)      // Failure
  });

}