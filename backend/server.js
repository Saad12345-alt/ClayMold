const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Product = require('./product')
const Order = require('./order')
const Admin = require('./admin')
const { connectDatabase } = require('./database')
const {
  createAdminToken,
  hashPassword,
  matchesInitKey,
  requireAdmin,
  verifyPassword
} = require('./auth')

const app = express()

app.use(cors());
app.use(express.json())

let databaseTarget;

// Escape user text so it is safe inside a RegExp (search box)
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Find a product by the numeric "id" (1, 2, 3...) or by the Mongo _id string
const findProductByParam = async (param) => {
  if (/^\d+$/.test(param)) {
    return Product.findOne({ id: Number(param) });
  }
  if (mongoose.isValidObjectId(param)) {
    return Product.findById(param);
  }
  return null;
};

app.get('/health', (req, res) => {
  res.json({ status: 'ok', database: databaseTarget });
});

// ==================== PUBLIC ROUTES ====================

// Get all products (search + category + sort)
// Example: /products?search=mouse&category=Mice&sort=high-low
app.get('/products', async (req, res) => {
  try {
    const search = (req.query.search || '').trim();
    const sortorder = req.query.sort || '';
    const category = req.query.category || '';

    const query = {};
    if (search) {
      query.name = new RegExp(escapeRegex(search), 'i');
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    const sortObj = {};
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

// Get up to 4 similar products (same category first, then others)
app.get('/products/:id/similar', async (req, res) => {
  try {
    const product = await findProductByParam(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const similar = await Product.find({
      category: product.category,
      id: { $ne: product.id }
    }).limit(4);

    if (similar.length < 4) {
      const others = await Product.find({
        category: { $ne: product.category },
        id: { $ne: product.id }
      }).limit(4 - similar.length);
      similar.push(...others);
    }

    res.json(similar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product by numeric id (or Mongo _id)
app.get('/products/:id', async (req, res) => {
  try {
    const product = await findProductByParam(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Place an order. The server recalculates prices from the database,
// so the browser can never choose its own price.
app.post('/orders', async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;

    if (!['cash', 'card'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Payment method must be cash or card' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    const orderItems = [];
    const neededByProduct = {};
    let total = 0;

    for (const item of items) {
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: 'Invalid quantity' });
      }

      const product = await findProductByParam(String(item.id));
      if (!product) {
        return res.status(404).json({ message: `Product ${item.id} not found` });
      }

      neededByProduct[product.id] = (neededByProduct[product.id] || 0) + quantity;
      if (product.stock < neededByProduct[product.id]) {
        return res.status(400).json({
          message: `${product.name} only has ${product.stock} left in stock`
        });
      }

      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        color: item.color || null
      });
      total += product.price * quantity;
    }

    // Reduce stock (checked again so two buyers cannot take the last item)
    for (const [productId, needed] of Object.entries(neededByProduct)) {
      const result = await Product.updateOne(
        { id: Number(productId), stock: { $gte: needed } },
        { $inc: { stock: -needed } }
      );
      if (result.modifiedCount === 0) {
        return res.status(409).json({ message: 'An item just went out of stock. Please review your cart.' });
      }
    }

    const order = await Order.create({
      items: orderItems,
      total: Math.round(total * 100) / 100,
      paymentMethod
    });

    res.status(201).json({
      orderId: order._id,
      total: order.total,
      paymentMethod: order.paymentMethod
    });
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

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordCheck = await verifyPassword(password, admin.password);
    if (!passwordCheck.valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (passwordCheck.needsRehash) {
      admin.password = await hashPassword(password);
      await admin.save();
    }

    res.json({
      message: 'Login successful',
      token: createAdminToken(admin),
      expiresIn: 3600,
      admin: { id: admin._id, username: admin.username, email: admin.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Register (protected - only first time or with special key)
app.post('/admin/register', async (req, res) => {
  try {
    if (!matchesInitKey(req.get('x-admin-init-key'))) {
      return res.status(401).json({ message: 'A valid initial admin key is required' });
    }

    if (await Admin.exists({})) {
      return res.status(403).json({ message: 'Admin registration is closed' });
    }

    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const newAdmin = new Admin({ username, password: await hashPassword(password), email });
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
app.post('/admin/products', requireAdmin, async (req, res) => {
  try {
    const { id, name, image, stock, totalnumberofitems, price, category, description, colors } = req.body;

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
      category: category || 'Accessories',
      description: description || '',
      colors: Array.isArray(colors) ? colors : [],
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
app.put('/admin/products/:id', requireAdmin, async (req, res) => {
  try {
    const { name, image, stock, totalnumberofitems, price, category, description, colors } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (name) product.name = name;
    if (image) product.image = image;
    if (stock !== undefined) product.stock = stock;
    if (totalnumberofitems !== undefined) product.totalnumberofitems = totalnumberofitems;
    if (price !== undefined) product.price = price;
    if (category) product.category = category;
    if (description !== undefined) product.description = description;
    if (Array.isArray(colors)) product.colors = colors;
    product.updatedAt = new Date();

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a product
app.delete('/admin/products/:id', requireAdmin, async (req, res) => {
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

// ==================== ORDER MANAGEMENT (ADMIN) ====================

const ORDER_STATUSES = ['pending', 'confirmed', 'delivered', 'cancelled'];

// Numbers for the dashboard cards. Cancelled orders do not count as sales.
const getOrderSummary = async () => {
  const notCancelled = { status: { $ne: 'cancelled' } };

  const [totals] = await Order.aggregate([
    { $match: notCancelled },
    { $group: { _id: null, orders: { $sum: 1 }, revenue: { $sum: '$total' } } }
  ]);
  const [sold] = await Order.aggregate([
    { $match: notCancelled },
    { $unwind: '$items' },
    { $group: { _id: null, itemsSold: { $sum: '$items.quantity' } } }
  ]);
  const pending = await Order.countDocuments({ status: 'pending' });

  return {
    orders: totals ? totals.orders : 0,
    revenue: totals ? Math.round(totals.revenue * 100) / 100 : 0,
    itemsSold: sold ? sold.itemsSold : 0,
    pending
  };
};

// List orders (newest first) + summary numbers
app.get('/admin/orders', requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).limit(200);
    const summary = await getOrderSummary();
    res.json({ orders, summary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Change an order's status. Cancelling puts the stock back (once only).
app.patch('/admin/orders/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }
    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status === 'cancelled') {
      return res.status(400).json({ message: 'A cancelled order cannot be changed' });
    }

    if (status === 'cancelled') {
      // The filter makes this flip atomic, so stock can only be restored once
      const cancelled = await Order.findOneAndUpdate(
        { _id: order._id, status: { $ne: 'cancelled' } },
        { status: 'cancelled' },
        { new: true }
      );
      if (!cancelled) {
        return res.status(409).json({ message: 'Order was already cancelled' });
      }
      for (const item of cancelled.items) {
        await Product.updateOne({ id: item.productId }, { $inc: { stock: item.quantity } });
      }
      return res.json(cancelled);
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = Number(process.env.PORT || 5000);

const startServer = async () => {
  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  databaseTarget = await connectDatabase();

  await new Promise((resolve, reject) => {
    const server = app.listen(PORT, () => resolve());
    server.once('error', reject);
  });
  console.log(`Server running on port ${PORT}`);
};

startServer().catch(async (error) => {
  console.error('Failed to start backend:', error.message);
  await mongoose.disconnect();
  process.exitCode = 1;
});
