const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Product = require('./product')
const Admin = require('./admin')

const app = express()

app.use(cors());
app.use(express.json())

mongoose.connect("mongodb://localhost:27017/Product");

// ==================== PUBLIC ROUTES ====================

// Get all products (with search and sort)
app.get('/products', async (req, res) => {
  try {
    const search = req.query.search || '';
    const sortorder = req.query.sort || '';
    const regex = new RegExp(search, 'i');

    let query = {};
    if (search) {
      query.name = regex;
    }

    // Build sort object
    let sortObj = {};
    if (sortorder === 'low-high') {
      sortObj.price = 1;
    } else if (sortorder === 'high-low') {
      sortObj.price = -1;
    }
  

    const products = await Product.find(query).sort(sortObj);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product by ID
app.get('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id; 
    const product = await Product.findById(productId); 

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== ADMIN AUTHENTICATION ====================

// Admin Login
app.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const admin = await Admin.findOne({ username });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ 
      message: 'Login successful',
      admin: { id: admin._id, username: admin.username, email: admin.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Register (protected - only first time or with special key)
app.post('/admin/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const newAdmin = new Admin({ username, password, email });
    await newAdmin.save();

    res.status(201).json({ 
      message: 'Admin created successfully',
      admin: { id: newAdmin._id, username: newAdmin.username, email: newAdmin.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== PRODUCT MANAGEMENT (ADMIN) ====================

// Create a new product
app.post('/admin/products', async (req, res) => {
  try {
    const { id, name, image, stock, totalnumberofitems, price } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const newProduct = new Product({
      id,
      name,
      image,
      stock: stock || 0,
      totalnumberofitems: totalnumberofitems || 0,
      price,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a product
app.put('/admin/products/:id', async (req, res) => {
  try {
    const { name, image, stock, totalnumberofitems, price } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (name) product.name = name;
    if (image) product.image = image;
    if (stock !== undefined) product.stock = stock;
    if (totalnumberofitems !== undefined) product.totalnumberofitems = totalnumberofitems;
    if (price !== undefined) product.price = price;
    product.updatedAt = new Date();

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a product
app.delete('/admin/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"))
