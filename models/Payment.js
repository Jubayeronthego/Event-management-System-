const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['mobile_banking', 'bank'],
    required: true
  },
  paymentProvider: {
    type: String,
    required: true
  },
  cardNumber: {
    type: String,
    default: null
  },
  mobileNumber: {
    type: String,
    default: null
  },
  amount: {
    type: Number,
    required: true
  },
  requiredAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['successful', 'unsuccessful'],
    required: true
  },
  services: [{
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    serviceName: {
      type: String,
      required: true
    },
    servicePrice: {
      type: Number,
      required: true
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    }
  }],
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Generate unique transaction ID - more robust approach
paymentSchema.pre('save', function(next) {
  // Always generate a transaction ID if it doesn't exist
  if (!this.transactionId || this.transactionId === '') {
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 11).toUpperCase();
    this.transactionId = `TXN${timestamp}${randomPart}`;
  }
  next();
});

// Also add a pre-validate hook as backup
paymentSchema.pre('validate', function(next) {
  if (!this.transactionId || this.transactionId === '') {
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 11).toUpperCase();
    this.transactionId = `TXN${timestamp}${randomPart}`;
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
