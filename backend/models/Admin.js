const mongoose = require('mongoose');

// Admin credentials live in the database, hashed with bcrypt - never as a
// hardcoded string in the source code. See seedAdmin.js for how the first
// admin account gets created from environment variables.
const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);
