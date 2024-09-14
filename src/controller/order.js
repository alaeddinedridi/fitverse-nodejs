const Order = require("../models/order");

// Save the order in the database
exports.create=(req,res)=>{
    
    const _order = new Order({
        ...req.body,
        user:req.user._id
    });
    _order.save((error, data) => {
        if (error) {
          console.log(error);
          return res.status(400).json({
            message: "something went wrong" + error,
          });
        }
    
        if (data) {
          console.log(data);
          console.log("order saved");
          return res.status(200).json({
              msg:"success"
          });
        }
      });
}

exports.read=(req,res)=>{
  Order.find({}).exec(function (err, orders) {
    res.send(orders)
  })
}