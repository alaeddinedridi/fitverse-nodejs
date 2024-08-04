const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const {createAdminAccount} = require("./src/controller/auth")

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin:['http://localhost:3000','http://127.0.0.1:3000'],
    credentials:true
}));

app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', "http://localhost:3000");
    res.header('Access-Control-Allow-Headers', true);
    res.header('Access-Control-Allow-Headers' , 'Authorization')
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});

mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.kzhfsb8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, 
    {useNewUrlParser: true, useUnifiedTopology: true}
).then(()=>{
    console.log('connected to database')
}).catch((e)=>{
    console.log('cannot connect'+e)
});

// create admin account
createAdminAccount()

const authRoutes = require('./src/routes/auth');
app.use(authRoutes);

const productRoutes = require('./src/routes/product');
app.use(productRoutes);

const paypalRoutes = require('./src/routes/paypal');
app.use(paypalRoutes);

const orderRoutes = require('./src/routes/order');

app.use(orderRoutes);

// Middleware to make the uploads folder accessible from url : /uploads
app.use('/uploads', express.static('uploads'));


const PORT= 3001 || 8080;
app.listen(PORT,()=>{
    console.log('server is listening to port :'+PORT)
});