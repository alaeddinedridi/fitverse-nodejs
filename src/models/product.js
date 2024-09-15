const mongoose = require('mongoose');

// This is the structure of "products" collection (table) in database
const productSchema = new mongoose.Schema({
    
    name: { type: String, required: true },
    slug: { type: String, required: true },
    category: { type: String, required: true },
    images: [{ type: String, required: true }],
    price: { type: String, required: true },
    brand: { type: String, required: true },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true }
   
},{timestamps:true});



const productModel = mongoose.model('Product', productSchema);
module.exports = productModel;