const express = require('express');
const router = express.Router();
const Payment = require('../../models/Payment');
const User = require('../../models/User');
const Booking = require('../../models/Booking');
const Service = require('../../models/Service');

// Get pending payments for a user
router.get('/pending/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user's pending bookings (where paymentStatus is 'pending')
    const pendingBookings = await Booking.find({
      customerId: userId,  // Changed from userId to customerId to match Booking model
      paymentStatus: 'pending'
    }).populate('serviceId');
    
    if (pendingBookings.length === 0) {
      return res.json({ 
        message: 'No pending payments found',
        totalDue: 0,
        services: []
      });
    }
    
    // Calculate total due from all pending bookings
    const totalDue = pendingBookings.reduce((total, booking) => total + booking.totalAmount, 0);
    
                // Map the services for payment
            const services = pendingBookings.map(booking => ({
              serviceId: booking.serviceId._id,
              serviceName: booking.serviceName,
              servicePrice: booking.totalAmount,
              bookingId: booking._id,
              vendorId: booking.serviceId.vendorId,
              vendorName: booking.vendorName
            }));
    
    res.json({
      totalDue,
      services,
      count: services.length
    });
    
  } catch (error) {
    console.error('Error fetching pending payments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Process payment
router.post('/process', async (req, res) => {
  try {
    const {
      userId,
      paymentMethod,
      paymentProvider,
      cardNumber,
      mobileNumber,
      amount,
      requiredAmount,
      services
    } = req.body;
    
    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if amount matches required amount
    const paymentStatus = amount === requiredAmount ? 'successful' : 'unsuccessful';
    
    // Generate transaction ID explicitly
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 11).toUpperCase();
    const transactionId = `TXN${timestamp}${randomPart}`;
    
    // Create payment record
    const payment = new Payment({
      userId,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.number,
      paymentMethod,
      paymentProvider,
      cardNumber: cardNumber || null,
      mobileNumber: mobileNumber || null,
      amount,
      requiredAmount,
      paymentStatus,
      services,
      transactionId // Explicitly set the transaction ID
    });
    
    await payment.save();
    
    // If payment is successful, update ALL related booking payment statuses and service availability
    if (paymentStatus === 'successful') {
      for (const service of services) {
        // Update booking status to 'paid'
        await Booking.findByIdAndUpdate(service.bookingId, {
          paymentStatus: 'paid',
          status: 'confirmed' // Also update booking status to confirmed
        });
        
        // Update service availability back to 'Yes' (available)
        await Service.findByIdAndUpdate(service.serviceId, {
          availability: 'Yes'
        });
      }
      
      res.json({
        success: true,
        paymentStatus,
        transactionId: payment.transactionId,
        message: 'Your Payment is Successful!!!'
      });
    } else {
      res.json({
        success: false,
        paymentStatus,
        transactionId: payment.transactionId,
        message: 'Payment unsuccessful - Amount does not match required amount'
      });
    }
    
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment history for a user
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .populate('services.serviceId');
    
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
