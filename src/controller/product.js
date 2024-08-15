const Product = require("../models/product");
const products=require('../products');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

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

// Configure multer storage and file name
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

exports.update=(req,res)=>{
      
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
    Product.findOne({ _id: req.params.id }).exec((err, product) => {
      if (product){
        console.log("found the product")
        if (typeof req.files != "undefined"){
          console.log("there are files to update")
          files.forEach((file) => {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            const maxSize = 5 * 1024 * 1024; // 5MB
      
            if (!allowedTypes.includes(file.mimetype)) {
              errors.push(`Invalid file type: ${file.originalname}`);
            }
      
            if (file.size > maxSize) {
              errors.push(`File too large: ${file.originalname}`);
            }
          });

          images = files.map(file => file.filename)
          console.log("files:"+images)

          if (errors.length > 0) {
            // Remove uploaded files
            files.forEach((file) => {
              fs.unlinkSync(file.path);
            });
      
            return res.status(400).json({ errors });
          }

          data = {name, category, brand, price, stock, description, images}

        }else{
          console.log("not going to update files")
          data = {name, category, brand, price, stock, description}
        }

        product.updateOne(data,function (err, success) {
          if (err) {
            console.log(err);
            return res.status(400).json({ error: "error" });
          } else {
            if (typeof req.files != "undefined"){
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
  
    //   Product.findOne({ _id: req.params.id }).exec((err, product) => {
    //     if (product){
    //       console.log("this is req.body: "+req.body)
    //       console.log("this is req.body.name: "+req.body.name)
      
    //       const {name, category, brand, price, stock, description} = req.body
    //       console.log("this is product: "+product)
    //       console.log("this is category: "+category)
    //       let images
    //       let data={}
    //       let files=[]
    //       console.log("typeof"+typeof req.files)
    //       if (typeof req.files != "undefined"){
    //         upload.array('files', 5)(req, res, (err) => {
    //           if (err) {
    //             return res.status(400).json({ error: err.message });
    //           }

    //           files = req.files;
    //           console.log("those are files: "+req.files)

    //           const errors = [];

    //           // Validate file types and sizes
    //           files.forEach((file) => {
    //             const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    //             const maxSize = 5 * 1024 * 1024; // 5MB

    //             if (!allowedTypes.includes(file.mimetype)) {
    //               errors.push(`Invalid file type: ${file.originalname}`);
    //             }

    //             if (file.size > maxSize) {
    //               errors.push(`File too large: ${file.originalname}`);
    //             }
    //           });

    //           images = files.map(file => file.filename)
    //           console.log("files:"+images)

    //           if (errors.length > 0) {
    //             // Remove uploaded files
    //             files.forEach((file) => {
    //               fs.unlinkSync(file.path);
    //             });
          
    //             return res.status(400).json({ errors });
    //           }
              
    //         })
    //         data = {name, category, brand, price, stock, description}
    //       }else{
    //         data = {name, category, brand, price, stock, description, images}
    //       }

          
    //       product.updateOne(data,function (err, success) {
    //         if (err) {
    //           console.log(err);
    //           return res.status(400).json({ error: "error" });
    //         } else {
    //           files.forEach((file) => {
    //             const filePath = `uploads/${file.filename}`;
    //             fs.rename(file.path, filePath, (err) => {
    //               if (err) {
    //                 // Handle error appropriately and send an error response
    //                 return res.status(500).json({ error: 'Failed to store the file' });
    //               }
    //             });
    //           });
    //           console.log({
    //             name, category, brand, price, stock, description
    //           });
    //           console.log("edited");
    //         }
    //       res.json(product)
    //     })
        
    //   }
    //   if (err){
    //     res.json({ err });
    //   }
    
    // })

      
}

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

exports.deleteById= (req,res)=>{
  Product.findOneAndRemove({ _id: req.params.id }, (err, product) => {
    if (err) {
      res.json({ err });
    }

    if (product){
      res.status(200).json({ message: "found and removed the product"})
    }
    
  })
}

exports.readByCategory =(req,res)=>{
  Product.find({}).exec(function (err, products) {
    products= products.filter(product => product.category==req.params.category)
    res.send(products)
  })
}



exports.create = (req, res) => {
  // Product.deleteMany().exec((err,succ)=>{
  //   res.send('success')
  // })
  Product.insertMany(products).then(function(){
    res.send("Data inserted")  // Success
  }).catch(function(error){
      res.send(error)      // Failure
  });
  
  // Product.insertMany(products).then(function(){
  //     res.send('success')  // Success
  // }).catch(function(error){
  //     res.send(error)     // Failure
  // });
    // const { 
    //     name,
    //     slug,
    //     category,
    //     image,
    //     price,
    //     brand,
    //     countInStock,
    //     description 
    // } = req.body;
    
  
    // const _product = new Product({
    //   name,
    //   slug,
    //   category,
    //   image,
    //   price,
    //   brand,
    //   countInStock,
    //   description
    // });
  
  
 
    // // Store the user in the database
    // _product.save((error, data) => {
    //   if (error) {
    //     console.log(error);
    //     return res.status(400).json({
    //       message: "something went wrong" + error,
    //     });
    //   }
  
    //   if (data) {
    //     console.log(data);
    //     console.log("account created");
    //     return res.status(400).json({
    //         name,
    //         slug,
    //         category,
    //         image,
    //         price,
    //         brand,
    //         countInStock,
    //         description
    //     });
    //   }
    // })
}