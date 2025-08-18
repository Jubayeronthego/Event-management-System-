const express = require('express');
const router = express.Router();
const Service = require('../../models/Service');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// @route   GET api/services
// @desc    Get all services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/services
// @desc    Create a new service listing
// @access  Private (Vendors only)
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { organizationName, category, availability, price, description, vendorName, vendorId } = req.body;
    
    // Validate required fields
    if (!organizationName || !category || !availability || !price || !description || !vendorName || !vendorId) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    // Create new service
    const newService = new Service({
      organizationName,
      category,
      availability,
      price: parseInt(price),
      description,
      vendorName,
      vendorId,
      photo: req.file ? `/uploads/${req.file.filename}` : null
    });

    const service = await newService.save();
    res.json({ msg: 'Service listing created successfully', service });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Clear all services (for testing)
router.post('/clear', async (req, res) => {
  try {
    await Service.deleteMany({});
    res.json({ msg: 'All services cleared successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DEMO: Insert dummy services if none exist (keeping this for future use)
router.post('/seed', async (req, res) => {
  try {
    const count = await Service.countDocuments();
    if (count > 0) return res.json({ msg: 'Services already exist' });
    
    // Only insert if no services exist
    res.json({ msg: 'No services to seed - database is empty' });
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