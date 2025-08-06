const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  images: [{ type: String }],
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);