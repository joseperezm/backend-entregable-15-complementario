const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  reference: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  email: { type: String, required: true, index: true, unique: true },
  age: { type: Number },
  role: { type: String, default: 'user' },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', default: null },
  password: { type: String },
  documents: { type: [documentSchema], default: [] },
  last_connection: { type: Date }
});

const User = mongoose.model('User', userSchema);

module.exports = User;