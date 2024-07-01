const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    isAdmin: { 
        type: Boolean, 
        required: true, 
        default: false 
    }
   
},{timestamps:true});

// Create a hash using the bcrypt module 
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