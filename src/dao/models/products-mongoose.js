const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const defaultAdminId = '661e105029357003bf99e660';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnails: { type: String, required: false, default: 'uploads/placeholder.jpg' },
  status: { type: Boolean, default: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: defaultAdminId
  }
});

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
