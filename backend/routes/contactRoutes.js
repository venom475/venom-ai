const express = require('express');
const router = express.Router();

// Placeholder for storing contact messages (in-memory for demo)
let messages = [];

// POST contact message
router.post('/', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  // In real app, save to DB or send email
  messages.push({ name, email, message, date: new Date() });
  res.json({ message: 'Message received successfully' });
});

module.exports = router;
