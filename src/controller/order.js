const Order = require("../models/order");

// Save the order in the database
exports.create=(req,res)=>{
    
  // Get order data sent by frontend: products, shipping address, payment method ..
    const _order = new Order({
        ...req.body,
        user:req.user._id
    });

    // Save order in database
    _order.save((error, data) => {
      // if there's an issue storing the order then return an error
        if (error) {
          console.log(error);
          return res.status(400).json({
            message: "something went wrong" + error,
          });
        }
        
      // otherwise return a success response
        if (data) {
          console.log(data);
          console.log("order saved");
          return res.status(200).json({
              msg:"success"
          });
        }
      });
}


// Read all orders from database so we can then display order on frontend
exports.read=(req,res)=>{
  Order.find({}).exec(function (err, orders) {
    res.send(orders)
  })
}