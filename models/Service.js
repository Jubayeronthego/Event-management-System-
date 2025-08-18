const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  organizationName: { type: String, required: true },
  category: { type: String, required: true, enum: ['Decoration', 'Photography', 'Transportation', 'Music', 'Food'] },
  price: { type: Number, required: true, min: 1 },
  availability: { type: String, required: true, enum: ['Yes', 'No'], default: 'Yes' },
  photo: { type: String }, // URL to uploaded photo
  vendorName: { type: String, required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true, maxlength: 150 },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);