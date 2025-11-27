// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, lowercase: true, index: true },
  passwordHash: String,
  mobile: String,
  address: String,
  dob: Date,
  sex: String,
  avatar: String, // base64 or URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
