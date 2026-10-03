// CONCEPT: User model - har user ka email aur HASHED password yahan save hoga.
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // same email se do account nahi ban sakte
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true }, // yahan plain password nahi, bcrypt hash save hoga
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
