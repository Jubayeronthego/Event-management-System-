const express = require('express');
const router = express.Router();
const Rating = require('../../models/Rating');

// Submit a rating
router.post('/submit', async (req, res) => {
  try {
    const {
      customerId,
      customerName,
      vendorId,
      vendorName,
      serviceId,
      serviceName,
      rating
    } = req.body;

    // Check if rating already exists for this customer-service combination
    const existingRating = await Rating.findOne({
      customerId,
      serviceId
    });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.ratingDate = new Date();
      await existingRating.save();

      return res.json({
        success: true,
        message: 'Rating updated successfully',
        rating: existingRating
      });
    }

    // Create new rating
    const newRating = new Rating({
      customerId,
      customerName,
      vendorId,
      vendorName,
      serviceId,
      serviceName,
      rating
    });

    await newRating.save();

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      rating: newRating
    });

  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get average rating for a vendor
router.get('/vendor/:vendorId', async (req, res) => {
  try {
    const { vendorId } = req.params;
    const ratings = await Rating.find({ vendorId });

    if (ratings.length === 0) {
      return res.json({
        averageRating: 0,
        totalRatings: 0,
        ratings: []
      });
    }

    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = (totalRating / ratings.length).toFixed(1);

    res.json({
      averageRating: parseFloat(averageRating),
      totalRatings: ratings.length,
      ratings
    });
  } catch (error) {
    console.error('Error fetching vendor ratings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all ratings for a vendor (for dashboard display)
router.get('/vendor/:vendorId/all', async (req, res) => {
  try {
    const { vendorId } = req.params;
    const ratings = await Rating.find({ vendorId })
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    console.error('Error fetching vendor ratings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ratings by customer
router.get('/customer/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const ratings = await Rating.find({ customerId })
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    console.error('Error fetching customer ratings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


