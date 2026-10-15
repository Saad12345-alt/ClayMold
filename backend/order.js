const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: Number,
    name: String,
    price: Number,
    quantity: Number,
    color: { type: String, default: null }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  items: { type: [orderItemSchema], required: true },
  total: { type: Number, required: true },
  // Only the method is stored. Card numbers, expiry and CVV are NEVER saved.
  paymentMethod: { type: String, enum: ['cash', 'card'], required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
