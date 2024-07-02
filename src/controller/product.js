const Product = require("../models/product");
const products=require('../products');

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

exports.read =(req,res)=>{
  Product.find({}).exec(function (err, products) {
    res.send(products)
  })
}

exports.readByCategory =(req,res)=>{
  Product.find({}).exec(function (err, products) {
    products= products.filter(product => product.category==req.params.category)
    res.send(products)
  })
}

exports.add = (req,res) => {
  console.log(req.body);
  const {name, category, brand, price, stock, description, pictures} = req.body
  
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