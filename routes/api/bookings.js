const express = require('express');
const router = express.Router();
const Booking = require('../../models/Booking');
const Service = require('../../models/Service');
const User = require('../../models/User');

// @route   GET api/bookings
// @desc    Get all bookings
// @access  Private
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { 
      customerId, 
      serviceId, 
      eventDate, 
      specialRequirements 
    } = req.body;

    // Validate required fields
    if (!customerId || !serviceId) {
      return res.status(400).json({ msg: 'Customer ID and Service ID are required' });
    }

    // Get customer information
    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }

    // Get service information
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }

    // Get vendor information
    const vendor = await User.findById(service.vendorId);
    if (!vendor) {
      return res.status(404).json({ msg: 'Vendor not found' });
    }

    // Check if service is available
    if (service.availability === 'No') {
      return res.status(400).json({ msg: 'Service is not available for booking' });
    }

    // Create new booking
    const newBooking = new Booking({
      customerId,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.number,
      
      vendorId: service.vendorId,
      vendorName: service.vendorName,
      vendorEmail: vendor.email,
      
      serviceId,
      serviceName: service.organizationName,
      serviceCategory: service.category,
      servicePrice: service.price,
      serviceDescription: service.description,
      
      eventDate: eventDate || null,
      totalAmount: service.price,
      specialRequirements: specialRequirements || ''
    });

    const booking = await newBooking.save();

    // Update service availability to 'No' after booking
    await Service.findByIdAndUpdate(serviceId, { availability: 'No' });

    res.json({ 
      msg: 'Booking created successfully', 
      booking 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/bookings/customer/:customerId
// @desc    Get all bookings for a customer
// @access  Private
router.get('/customer/:customerId', async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.params.customerId })
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/bookings/vendor/:vendorId
// @desc    Get all bookings for a vendor
// @access  Private
router.get('/vendor/:vendorId', async (req, res) => {
  try {
    const bookings = await Booking.find({ vendorId: req.params.vendorId })
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/bookings/:id
// @desc    Get a specific booking by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/bookings/:id/status
// @desc    Update booking status
// @access  Private
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ msg: 'Status is required' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    res.json({ msg: 'Booking status updated successfully', booking });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/bookings/:id/payment
// @desc    Update payment status
// @access  Private
router.put('/:id/payment', async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    if (!paymentStatus) {
      return res.status(400).json({ msg: 'Payment status is required' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    res.json({ msg: 'Payment status updated successfully', booking });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

