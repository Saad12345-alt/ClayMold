const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: Number,
    name: String,
    image: String,
    stock: Number,
    totalnumberofitems: Number,
    price: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const Product = mongoose.model("Product", productSchema);

module.exports = Product;