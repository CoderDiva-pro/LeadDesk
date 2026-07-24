const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address'],
    },
    budgetRange: {
      type: String,
      required: [true, 'Budget range is required'],
      enum: ['under-1k', '1k-5k', '5k-15k', '15k-50k', '50k-plus'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Closed'],
      default: 'New',
    },
  },
  { timestamps: true }
);

// Supports the admin search box (name, email, message)
leadSchema.index({ name: 'text', email: 'text', message: 'text' });

module.exports = mongoose.model('Lead', leadSchema);
