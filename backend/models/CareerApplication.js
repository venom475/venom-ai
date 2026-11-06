const mongoose = require('mongoose');

const careerApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  role: { type: String, required: true, trim: true, maxlength: 120 },
  details: { type: String, trim: true, maxlength: 5000 },
  status: { type: String, enum: ['new', 'reviewing', 'contacted', 'closed'], default: 'new' }
}, { timestamps: true });

module.exports = mongoose.model('CareerApplication', careerApplicationSchema);
