const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String },
  author: { type: String },
  publishedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
