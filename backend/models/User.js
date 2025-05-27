const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: { type: String, default: null } // URL or path to profile photo
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
