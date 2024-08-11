const User = require("../models/user");

exports.read=(req,res)=>{
    User.find({}).exec(function (err, users) {
      res.send(users)
    })
}