const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already registered' });
    }
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: 'User not found or invalid credentials' });
    }
    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to login user' });
  }
});

// Upload or update profile photo
router.post('/photo/:userId', upload.single('photo'), async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }
    const user = await User.findById(userId);
    if (!user) {
      // Delete uploaded file if user not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'User not found' });
    }
    // Delete old photo if exists
    if (user.photo) {
      const oldPhotoPath = path.join(__dirname, '../../', user.photo);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }
    user.photo = req.file.path;
    await user.save();
    res.json({ message: 'Photo uploaded successfully', photo: user.photo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

// Delete profile photo
router.delete('/photo/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user || !user.photo) {
      return res.status(404).json({ error: 'User or photo not found' });
    }
    const photoPath = path.join(__dirname, '../../', user.photo);
    if (fs.existsSync(photoPath)) {
      fs.unlinkSync(photoPath);
    }
    user.photo = null;
    await user.save();
    res.json({ message: 'Photo deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

module.exports = router;
