const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// This is the structure of users collection (table) in database
const userSchema = new mongoose.Schema({
    
    fullname : {
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        lowercase:true
    },
    hash_password : {
        type:String,
        required:true
    },
    role: { 
        type: String, 
        required: true, 
        default: "user" 
    }
   
},{timestamps:true});

// Create a hash (encrypted password) using the bcrypt module 
userSchema.virtual('password')
.set(function(password){
    this.hash_password=bcrypt.hashSync(password,10)
});

// Function that compare passwords
userSchema.methods ={
    authenticate : function(password){
        return bcrypt.compareSync(password,this.hash_password);
    }
};

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;