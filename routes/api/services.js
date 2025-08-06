const express = require('express');
const router = express.Router();
const Service = require('../../models/Service');

// @route   GET api/services
// @desc    Get all services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DEMO: Insert dummy services if none exist
router.post('/seed', async (req, res) => {
  try {
    const count = await Service.countDocuments();
    if (count > 0) return res.json({ msg: 'Services already exist' });
    
    await Service.insertMany([
      // Photography Services
      {
        name: 'Dreamweavers Photography',
        category: 'Photography',
        price: 25000,
        availability: true,
        images: ['https://images.unsplash.com/photo-1464983953574-0892a716854b'],
        description: 'Professional wedding and event photography with artistic flair. Specializing in candid moments and creative compositions.'
      },
      {
        name: 'Click Photography Studio',
        category: 'Photography',
        price: 18000,
        availability: true,
        images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32'],
        description: 'Modern photography studio offering high-quality event coverage with contemporary style and professional equipment.'
      },
      {
        name: 'Renaissance Photography',
        category: 'Photography',
        price: 30000,
        availability: true,
        images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4'],
        description: 'Premium photography service with vintage and artistic approach. Perfect for elegant and sophisticated events.'
      },
      {
        name: 'Capture Moments',
        category: 'Photography',
        price: 15000,
        availability: true,
        images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32'],
        description: 'Affordable photography service capturing all your special moments with professional quality and friendly service.'
      },
      {
        name: 'Elite Photography',
        category: 'Photography',
        price: 35000,
        availability: false,
        images: ['https://images.unsplash.com/photo-1464983953574-0892a716854b'],
        description: 'Luxury photography service for high-end events. Currently fully booked for the season.'
      },

      // Decoration Services
      {
        name: 'Elegant Decorations',
        category: 'Decoration',
        price: 20000,
        availability: true,
        images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb'],
        description: 'Luxurious wedding and event decorations with premium flowers and elegant designs.'
      },
      {
        name: 'Flora & Fauna Decor',
        category: 'Decoration',
        price: 15000,
        availability: true,
        images: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed'],
        description: 'Natural and organic decoration themes using fresh flowers and sustainable materials.'
      },
      {
        name: 'Modern Events Decor',
        category: 'Decoration',
        price: 18000,
        availability: true,
        images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3'],
        description: 'Contemporary decoration styles with modern aesthetics and innovative design concepts.'
      },
      {
        name: 'Royal Decorations',
        category: 'Decoration',
        price: 25000,
        availability: true,
        images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb'],
        description: 'Royal-themed decorations with opulent designs and premium materials for grand celebrations.'
      },

      // Catering Services
      {
        name: 'Gourmet Catering',
        category: 'Catering',
        price: 30000,
        availability: true,
        images: ['https://images.unsplash.com/photo-1519864600265-abb23847ef2c'],
        description: 'Premium catering service with gourmet cuisine and professional chefs for upscale events.'
      },
      {
        name: 'Traditional Catering',
        category: 'Catering',
        price: 20000,
        availability: true,
        images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1'],
        description: 'Authentic traditional cuisine with local flavors and home-style cooking for cultural events.'
      },
      {
        name: 'Fusion Catering',
        category: 'Catering',
        price: 25000,
        availability: true,
        images: ['https://images.unsplash.com/photo-1519864600265-abb23847ef2c'],
        description: 'Modern fusion cuisine combining international flavors with local ingredients.'
      },

      // Entertainment Services
      {
        name: 'Live Band Entertainment',
        category: 'Entertainment',
        price: 35000,
        availability: true,
        images: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f'],
        description: 'Professional live band performing popular songs and custom requests for your special day.'
      },
      {
        name: 'DJ Services',
        category: 'Entertainment',
        price: 15000,
        availability: true,
        images: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f'],
        description: 'Professional DJ with modern equipment and extensive music library for all types of events.'
      },
      {
        name: 'Classical Music Ensemble',
        category: 'Entertainment',
        price: 40000,
        availability: true,
        images: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f'],
        description: 'Elegant classical music performance by professional musicians for sophisticated events.'
      },

      // Venue Services
      {
        name: 'Grand Ballroom',
        category: 'Venue',
        price: 50000,
        availability: true,
        images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3'],
        description: 'Luxurious grand ballroom with capacity for 500+ guests, perfect for large celebrations.'
      },
      {
        name: 'Garden Venue',
        category: 'Venue',
        price: 35000,
        availability: true,
        images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3'],
        description: 'Beautiful outdoor garden venue with natural surroundings and romantic atmosphere.'
      },
      {
        name: 'Rooftop Events',
        category: 'Venue',
        price: 40000,
        availability: true,
        images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3'],
        description: 'Exclusive rooftop venue with stunning city views and modern amenities.'
      },

      // Transportation Services
      {
        name: 'Luxury Car Service',
        category: 'Transportation',
        price: 12000,
        availability: true,
        images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2'],
        description: 'Premium luxury car service for wedding transportation with professional chauffeurs.'
      },
      {
        name: 'Vintage Car Collection',
        category: 'Transportation',
        price: 18000,
        availability: true,
        images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2'],
        description: 'Classic vintage cars for unique and memorable wedding transportation experience.'
      }
    ]);
    
    res.json({ msg: 'Comprehensive services inserted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Clear all services (for testing)
router.delete('/clear', async (req, res) => {
  try {
    await Service.deleteMany({});
    res.json({ msg: 'All services cleared' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;