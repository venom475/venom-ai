const express = require('express');
const ContactEnquiry = require('../models/ContactEnquiry');

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  try {
    const enquiry = await ContactEnquiry.create({ name, email, message });
    res.status(201).json({
      message: 'Enquiry received successfully',
      enquiryId: enquiry._id
    });
  } catch (error) {
    console.error('Failed to save contact enquiry:', error);
    res.status(500).json({ error: 'Failed to save enquiry' });
  }
});

module.exports = router;
