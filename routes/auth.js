const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');
const { signupSchema, loginSchema } = require('../validation/schemas');

const router = express.Router();

function makeToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

// CONCEPT: validate(signupSchema) route handler chalne SE PEHLE data check karta hai.
// Agar galat hai, route ka code kabhi chalta hi nahi.
router.post('/signup', validate(signupSchema), asyncHandler(async (req, res) => {
  const email = req.body.email.toLowerCase().trim();
  const { password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });

  res.status(201).json({ message: 'Signup successful', token: makeToken(user._id) });
}));

router.post('/login', validate(loginSchema), asyncHandler(async (req, res) => {
  const email = req.body.email.toLowerCase().trim();
  const { password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.status(200).json({ message: 'Login successful', token: makeToken(user._id) });
}));

module.exports = router;
