const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Vehicle = require('../models/Vehicle'); // Add this line

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads/vehicles');
    // Ensure directory exists
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log('Upload path:', uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Allow only image files
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Routes
router.get('/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();
    res.json(vehicles);
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/vehicles', async (req, res) => {
  try {
    const vehicle = await Vehicle.create({
      ...req.body,
      stockNumber: `SMK${Math.floor(Math.random() * 90000) + 10000}`
    });
    res.status(201).json(vehicle);
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(400).json({ error: error.message });
  }
});

router.post('/vehicles/:id/images', upload.array('images', 5), async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Create image paths
    const imagePaths = req.files.map(file => `/uploads/vehicles/${file.filename}`);
    console.log('Image paths:', imagePaths);

    // Update vehicle with new image paths
    const updatedVehicle = await vehicle.update({
      images: vehicle.images ? [...vehicle.images, ...imagePaths] : imagePaths
    });

    res.json(updatedVehicle);
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/vehicles/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/vehicles/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    await vehicle.update(req.body);
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/vehicles/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    await vehicle.destroy();
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;