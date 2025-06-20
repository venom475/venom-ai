const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const { generateCode } = require('./openaiService');
const modelRoutes = require('./routes/modelRoutes');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const contactRoutes = require('./routes/contactRoutes');
const { verify } = require('./oauthConfig');
const app = express();
const PORT = process.env.PORT || 8080;

// Use environment variable for MongoDB URI with fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/venom';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

app.use(cors());
app.use(express.json());

// Serve frontend static files from project root
const path = require('path');
app.use(express.static(path.join(__dirname, '..')));
app.use(express.static(path.resolve(__dirname, '../..')));

// Google OAuth login endpoint
app.post('/api/google-login', async (req, res) => {
  const { token } = req.body;
  try {
    const payload = await verify(token);
    const { sub, email, name, picture } = payload;

    // Check if user exists, else create new user
    let user = await User.findOne({ googleId: sub });
    if (!user) {
      user = new User({
        googleId: sub,
        email,
        username: name,
        photo: picture,
      });
      await user.save();
    }
    res.json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

// Root route to confirm server is running
app.get('/', (req, res) => {
  res.send('Welcome to the VENOM backend server');
});

// User registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already registered' });
    }
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: 'User not found or invalid credentials' });
    }
    res.json({ message: 'Login successful', userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to login user' });
  }
});

// New endpoint to generate AI code using OpenAI API
app.post('/api/generate-code', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    const generatedCode = await generateCode(prompt);
    res.json({ generatedCode });
  } catch (error) {
    console.error('Error generating code:', error);
    res.status(500).json({ error: 'Failed to generate code' });
  }
});

// Use model routes for AI model builder
app.use('/api/models', modelRoutes);
// Use user routes for profile and photo management
app.use('/api/users', userRoutes);
// Use blog routes for blog data
app.use('/api/blog', blogRoutes);
// Use contact routes for contact management
app.use('/api/contact', contactRoutes);

// Catch-all 404 middleware for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Resource not found' });
});

// Error-handling middleware for other errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
