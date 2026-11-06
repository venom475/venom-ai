const mongoose = require('mongoose');

const contactEnquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  message: { type: String, required: true, trim: true, maxlength: 5000 },
  status: { type: String, enum: ['new', 'in_progress', 'closed'], default: 'new' }
}, { timestamps: true });

module.exports = mongoose.model('ContactEnquiry', contactEnquirySchema);
