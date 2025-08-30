const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Service = require('../../models/Service');
const Booking = require('../../models/Booking');
const Review = require('../../models/Review');
const Rating = require('../../models/Rating');
const Payment = require('../../models/Payment');
const bcrypt = require('bcryptjs');

// @route   GET api/users
// @desc    Get users (all or filtered by role for admin)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};
    
    if (role) {
      query.role = role;
    }
    
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/users/debug
// @desc    Debug route to check users
// @access  Public
router.get('/debug', async (req, res) => {
  try {
    const users = await User.find();
    res.json({ 
      count: users.length, 
      users: users.map(u => ({ 
        id: u._id, 
        name: u.name, 
        email: u.email, 
        role: u.role,
        hasPassword: !!u.password,
        passwordLength: u.password ? u.password.length : 0
      }))
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/users/clear
// @desc    Clear all users (for testing)
// @access  Public
router.delete('/clear', async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({ msg: 'All users cleared' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users
// @desc    Register a user (legacy route)
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, password, number, address, role } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      number,
      address,
      role: role || 'customer'
    });

    await user.save();

    res.json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users/signup
// @desc    Register a user
// @access  Public
router.post('/signup', async (req, res) => {
  const { name, email, password, number, address, role } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      number,
      address,
      role: role || 'customer'
    });

    await user.save();

    res.json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Return user data without password
    const { password: pw, ...userData } = user.toObject();
    res.json(userData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



// @route   DELETE api/users/:id
// @desc    Delete a user (for admin)
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

            // Prevent admin from deleting themselves
        if (user.role === 'admin') {
          return res.status(400).json({ msg: 'Cannot delete admin accounts' });
        }

        // If deleting a vendor, also delete all their service listings and related data
        if (user.role === 'vendor') {
          try {
            console.log(`Starting cleanup for vendor ${user.name} (ID: ${req.params.id})`);
            
            // First, get all service IDs for this vendor before deleting them
            const vendorServices = await Service.find({ vendorId: req.params.id });
            const serviceIds = vendorServices.map(service => service._id);
            console.log(`Found ${serviceIds.length} services for vendor ${user.name}`);
            
            // Delete all payments associated with this vendor's services first
            if (serviceIds.length > 0) {
              const paymentResult = await Payment.deleteMany({ 'services.serviceId': { $in: serviceIds } });
              console.log(`Deleted ${paymentResult.deletedCount} payments for vendor ${user.name}`);
            }
            
            // Delete all services for this vendor
            const serviceResult = await Service.deleteMany({ vendorId: req.params.id });
            console.log(`Deleted ${serviceResult.deletedCount} services for vendor ${user.name}`);
            
            // Delete all bookings for this vendor
            const bookingResult = await Booking.deleteMany({ vendorId: req.params.id });
            console.log(`Deleted ${bookingResult.deletedCount} bookings for vendor ${user.name}`);
            
            // Delete all reviews and ratings for this vendor
            const reviewResult = await Review.deleteMany({ vendorId: req.params.id });
            const ratingResult = await Rating.deleteMany({ vendorId: req.params.id });
            console.log(`Deleted ${reviewResult.deletedCount} reviews and ${ratingResult.deletedCount} ratings for vendor ${user.name}`);
            
            console.log(`Completed cleanup for vendor ${user.name}`);
          } catch (error) {
            console.error('Error deleting vendor data:', error);
            // Continue with user deletion even if related data deletion fails
          }
        }
        
        // If deleting a customer, also delete all their bookings, reviews, and ratings
        if (user.role === 'customer') {
          try {
            await Booking.deleteMany({ customerId: req.params.id });
            await Review.deleteMany({ customerId: req.params.id });
            await Rating.deleteMany({ customerId: req.params.id });
            console.log(`Deleted all bookings, reviews, and ratings for customer ${user.name} (ID: ${req.params.id})`);
            
            // Delete all payments made by this customer
            await Payment.deleteMany({ userId: req.params.id });
            console.log(`Deleted all payments for customer ${user.name} (ID: ${req.params.id})`);
          } catch (error) {
            console.error('Error deleting customer data:', error);
            // Continue with user deletion even if related data deletion fails
          }
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users/cleanup-orphaned
// @desc    Clean up orphaned services, bookings, reviews, and ratings (for admin use)
// @access  Public
router.post('/cleanup-orphaned', async (req, res) => {
  try {
    console.log('Starting cleanup of orphaned data...');
    
    // Find and delete services with non-existent vendors
    const allServices = await Service.find();
    let orphanedServicesCount = 0;
    
    for (const service of allServices) {
      const vendorExists = await User.findById(service.vendorId);
      if (!vendorExists) {
        await Service.findByIdAndDelete(service._id);
        orphanedServicesCount++;
        console.log(`Deleted orphaned service: ${service.organizationName} (vendor ID: ${service.vendorId})`);
      }
    }
    
    // Find and delete bookings with non-existent vendors or customers
    const allBookings = await Booking.find();
    let orphanedBookingsCount = 0;
    
    for (const booking of allBookings) {
      const vendorExists = await User.findById(booking.vendorId);
      const customerExists = await User.findById(booking.customerId);
      const serviceExists = await Service.findById(booking.serviceId);
      
      if (!vendorExists || !customerExists || !serviceExists) {
        await Booking.findByIdAndDelete(booking._id);
        orphanedBookingsCount++;
        console.log(`Deleted orphaned booking: ${booking.serviceName} (ID: ${booking._id})`);
      }
    }
    
    // Find and delete reviews with non-existent vendors or customers
    const allReviews = await Review.find();
    let orphanedReviewsCount = 0;
    
    for (const review of allReviews) {
      const vendorExists = await User.findById(review.vendorId);
      const customerExists = await User.findById(review.customerId);
      const serviceExists = await Service.findById(review.serviceId);
      
      if (!vendorExists || !customerExists || !serviceExists) {
        await Review.findByIdAndDelete(review._id);
        orphanedReviewsCount++;
        console.log(`Deleted orphaned review for service: ${review.serviceName}`);
      }
    }
    
    // Find and delete ratings with non-existent vendors or customers
    const allRatings = await Rating.find();
    let orphanedRatingsCount = 0;
    
    for (const rating of allRatings) {
      const vendorExists = await User.findById(rating.vendorId);
      const customerExists = await User.findById(rating.customerId);
      const serviceExists = await Service.findById(rating.serviceId);
      
      if (!vendorExists || !customerExists || !serviceExists) {
        await Rating.findByIdAndDelete(rating._id);
        orphanedRatingsCount++;
        console.log(`Deleted orphaned rating for service: ${rating.serviceName}`);
      }
    }
    
    console.log('Cleanup completed:', {
      orphanedServices: orphanedServicesCount,
      orphanedBookings: orphanedBookingsCount,
      orphanedReviews: orphanedReviewsCount,
      orphanedRatings: orphanedRatingsCount
    });
    
    res.json({
      msg: 'Cleanup completed successfully',
      deleted: {
        services: orphanedServicesCount,
        bookings: orphanedBookingsCount,
        reviews: orphanedReviewsCount,
        ratings: orphanedRatingsCount
      }
    });
    
  } catch (err) {
    console.error('Error during cleanup:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 