const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Customer Information
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  
  // Vendor Information
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorName: { type: String, required: true },
  vendorEmail: { type: String, required: true },
  
  // Service Information
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  serviceName: { type: String, required: true }, // organizationName from service
  serviceCategory: { type: String, required: true },
  servicePrice: { type: Number, required: true },
  serviceDescription: { type: String, required: true },
  
  // Booking Details
  bookingDate: { type: Date, default: Date.now },
  eventDate: { type: Date }, // Optional: when the event is scheduled
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  
  // Payment Information
  totalAmount: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'refunded'], 
    default: 'pending' 
  },
  
  // Additional Information
  specialRequirements: { type: String }, // Any special requests from customer
  notes: { type: String }, // Internal notes
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);

