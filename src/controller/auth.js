const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { decode } = require("punycode");
const util = require('util');

// Create admin account
exports.createAdminAccount = (req, res) => {
  // Check if admin account already exists
  User.findOne({ email: "admin@fitverse.com" }).exec((error, admin) => {
    if (admin) {
      console.log("Admin already registered")
      return 0
    }

    if (error) {
      console.log("error:"+error)
      return 0
    }

    // if admin account does not exist then prepare admin account informations
    const {fullname, email, password, role} = {fullname:"Ahmed Dridi", email:"admin@fitverse.com", password:"admin1234", role:"admin"}
    const _admin = new User({
      fullname,
      email,
      password,
      role
    });

    // Store admin account in the database
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


// Create user account
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
  
    // if user account does not exist then prepare new user account informations
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
        // Return a success response with account informations to frontend
        return res.status(200).json({
            fullname,
            email,
            password,
            token: token,
        });
      }
    });
  };


  // Login function for user and admin
  exports.login = (req, res) => {
    // find the account using the email address
    User.findOne({ email: req.body.email }).exec((error, user) => {
      if (error) {
        console.log("inside first error")
        return res.status(400).json({ error });
      }
      if (user) {
        console.log("found admin")
        // Check if the password entered by the user matches the one saved in database
        console.log("this is the admin pass:"+ user.authenticate(req.body.password))
        if (user.authenticate(req.body.password)) {
          // Create a token available for 1 hour and login user
          const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
            expiresIn: "1m",
          });
          // Return a success response with user/admin informations to frontend
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
          console.log("second error")
          res.status(400).json({ message: "something went wrong" });
        }
      } else {
        console.log("account doesn't exist");
      }
    });
  };

  exports.isTokenExpired = (req, res) => {
      console.log('inside isTokenExpired')
      // Get token from the authorization header in request sent from frontend
      const token = req.headers.authorization.split(" ")[1];
      //console.log(token)

      const { TokenExpiredError } = jwt;

      // Verify that the user is logged in using that token
      const user = jwt.verify(token, process.env.JWT_KEY, (error,decoded)=>{
        console.log("started verifying token")
        //Check if token has expired
        if (error){
          console.log("there's error in token")
          if (error instanceof TokenExpiredError) {
            console.log("return verify token negative")
            return res.status(401).json({expired:true})
          }
        
        }
        console.log("token is correct")
        return decoded
      });

      console.log("return verify token positive")
      return res.status(200).json({expired:false})
  }
  
  exports.isAuthorized = (permission) => {
    return (req, res, next) => {
      console.log('inside require signin')
      // Get token from the authorization header in request sent from frontend
      const token = req.headers.authorization.split(" ")[1];
      //console.log(token)

      const { TokenExpiredError } = jwt;

      console.log("isAuthorized - started verifying token")
      // Verify that the user is logged in using that token
      const user = jwt.verify(token, process.env.JWT_KEY, (error,decoded)=>{
        //Check if token has expired
        if (error){
          console.log("isAuthorized - there's error in token")
          if (error instanceof TokenExpiredError) {
            console.log("isAuthorized - return verify token negative")
            return res.status(401).send("Unauthorized! Access Token was expired!");
          }
        
        }
        console.log("isAuthorized - token is correct")
        return decoded
      });
      //console.log ("the user: "+user)

      // if there's no user logged in then return an error
      if (!user){
        return res.status(401).send('unauthorized request')
      }

      

      // the request really comes from a logged in user
      req.user = user
      //console.log("this is req.user: "+req.user)
      //console.log(util.inspect(user, {depth: null}));

      // get that user from database
      User.findOne({ _id: user._id }).exec((error, user) => {
        if (error) {
          return res.status(400).json({ error });
        }

        // verify the role of that user account, and based on the role allow him to access or not to a ressource (page)
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
  

