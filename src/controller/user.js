const User = require("../models/user");

// Read all users from database
exports.read=(req,res)=>{
    User.find({}).exec(function (err, users) {
      res.send(users)
    })
}