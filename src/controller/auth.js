const User = require("../models/user");
const jwt = require("jsonwebtoken");

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
          const { _id, fullname, email } = user;
          res.status(200).json({
            token,
            user: {
              _id,
              fullname,  
              email
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
  
  exports.requireSignin = (req, res, next) => {
    console.log('inside require signin')
    // Get token from the authorization header
    const token = req.headers.authorization.split(" ")[1];
    //const token = req.body.token;
    // Verify that the user is logged in
    //const user = jwt.verify(token, process.env.JWT_KEY)
    const user = jwt.verify(token, process.env.JWT_KEY);
    if (!user){
      return res.status(401).send('unauthorized request')
    }
    req.user = user
    next()
  };
  