const express = require('express');
const router = express.Router();
const Review = require('../../models/Review');

// Submit a review
router.post('/submit', async (req, res) => {
  try {
    const {
      customerId,
      customerName,
      vendorId,
      vendorName,
      serviceId,
      serviceName,
      comment
    } = req.body;

    // Check if review already exists for this customer-service combination
    const existingReview = await Review.findOne({
      customerId,
      serviceId
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this service' 
      });
    }

    // Create new review
    const review = new Review({
      customerId,
      customerName,
      vendorId,
      vendorName,
      serviceId,
      serviceName,
      comment
    });

    await review.save();

    res.json({
      success: true,
      message: 'Review submitted successfully',
      review
    });

  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reviews for a vendor
router.get('/vendor/:vendorId', async (req, res) => {
  try {
    const { vendorId } = req.params;
    const reviews = await Review.find({ vendorId })
      .sort({ createdAt: -1 })
      .populate('customerId', 'name');

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching vendor reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reviews by customer
router.get('/customer/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const reviews = await Review.find({ customerId })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching customer reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;





