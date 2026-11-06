const express = require('express');
const CareerApplication = require('../models/CareerApplication');

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, role, details } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Name, email, and area of interest are required' });
  }

  try {
    const application = await CareerApplication.create({ name, email, role, details });
    res.status(201).json({
      message: 'Application received successfully',
      applicationId: application._id
    });
  } catch (error) {
    console.error('Failed to save career application:', error);
    res.status(500).json({ error: 'Failed to save application' });
  }
});

module.exports = router;
