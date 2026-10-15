const mongoose = require('mongoose');

// One selectable colour for a product. "image" is optional:
// if it is missing, the product's main image is used.
const colorSchema = new mongoose.Schema(
  {
    name: String,
    hex: String,
    image: String
  },
  { _id: false }
);

const productSchema = new mongoose.Schema({
    id: Number,
    name: String,
    image: String,
    stock: Number,
    totalnumberofitems: Number,
    price: Number,
    category: { type: String, default: 'Accessories' },
    description: { type: String, default: '' },
    colors: { type: [colorSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
