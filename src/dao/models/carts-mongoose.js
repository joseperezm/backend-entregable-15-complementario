const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true, min: 1 }
  }],
  status: { type: String, default: 'active' },
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;