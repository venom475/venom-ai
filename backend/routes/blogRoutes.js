const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const BlogPost = require('../models/BlogPost');

// Configure multer for photo uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ publishedDate: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Create a new blog post with photo upload
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { title, summary, content, author } = req.body;
    const photo = req.file ? '/uploads/' + req.file.filename : null;

    const newPost = new BlogPost({
      title,
      summary,
      content,
      author,
      photo
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// Delete a blog post by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json({ message: 'Blog post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

module.exports = router;
