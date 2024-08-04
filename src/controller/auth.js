const User = require("../models/user");
const jwt = require("jsonwebtoken");
const util = require('util');


exports.createAdminAccount = (req, res) => {
  User.findOne({ email: "admin@fitverse.com" }).exec((error, admin) => {
    if (admin) {
      return res.status(400).json({
        message: "Admin already registered.",
      });
    }

    const {fullname, email, password, role} = {fullname:"Ahmed Dridi", email:"admin@fitverse.com", password:"admin1234", role:"admin"}
    const _admin = new User({
      fullname,
      email,
      password,
      role
    });

    _admin.save((error, data) => {
      if (error) {
        console.log(error);
        return res.status(400).json({
          message: "something went wrong" + error,
        });
      }
  
      if (data) {
        console.log(data);
        console.log("Admin account created");
      }
    });
  });
}


exports.register = (req, res) => {
    // Check if the email address is already in use
    User.findOne({ email: req.body.email }).exec((error, user) => {
      if (user) {
        return res.status(400).json({
          message: "User already registered.",
        });
      }
    });
  
    const { fullname, email, password } = req.body;
    console.log(fullname+""+email+""+password)
  
    // create a new token that will be available for 20 minutes
    const token = jwt.sign({ email, password }, process.env.JWT_KEY, {
      expiresIn: "20m",
    });
  
    const _user = new User({
      fullname,
      email,
      password,
    });
  
  
 
    // Store the user in the database
    _user.save((error, data) => {
      if (error) {
        console.log(error);
        return res.status(400).json({
          message: "something went wrong" + error,
        });
      }
  
      if (data) {
        console.log(data);
        console.log("account created");
        return res.status(200).json({
            fullname,
            email,
            password,
            token: token,
        });
      }
    });
  };


  exports.login = (req, res) => {
    // find the account using the email address
    User.findOne({ email: req.body.email }).exec((error, user) => {
      if (error) {
        return res.status(400).json({ error });
      }
      if (user) {
        // Check if the password entered by the user matches the one saved in database
        if (user.authenticate(req.body.password)) {
          // Create a token available for 1 hour and login user
          const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
            expiresIn: "99999999999h",
          });
          const { _id, fullname, email,role } = user;
          res.status(200).json({
            token,
            user: {
              _id,
              fullname,  
              email,
              role
            },
          });
          console.log("logged in");
        } else {
          res.status(400).json({ message: "something went wrong" });
        }
      } else {
        console.log("account doesn't exist");
      }
    });
  };
  
  exports.isAuthorized = (permission) => {
    return (req, res, next) => {
      console.log('inside require signin')
      // Get token from the authorization header
      const token = req.headers.authorization.split(" ")[1];
      //const token = req.headers.authorization;
      console.log(token)
      //const token = req.body.token;
      // Verify that the user is logged in
      //const user = jwt.verify(token, process.env.JWT_KEY)
      const user = jwt.verify(token, process.env.JWT_KEY);
      console.log ("the user: "+user)
      if (!user){
        return res.status(401).send('unauthorized request')
      }
      req.user = user
      console.log("this is req.user: "+req.user)
      console.log(util.inspect(user, {depth: null}));

      User.findOne({ _id: user._id }).exec((error, user) => {
        if (error) {
          return res.status(400).json({ error });
        }
        if (user) {
          console.log("this is the role:"+user.role)
          const role = user.role
          if (permission === role) {
            next()
          }else{
            console.log("You don't have permission to access to the request resource")
            return res.status(401).json("You don't have permission to access to the request resource")
          }
        }
      })
    }
    
  };
  

