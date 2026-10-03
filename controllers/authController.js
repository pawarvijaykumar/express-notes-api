// CONCEPT: CONTROLLER - route se sirf "kaam" karne wala function yahan hai.
// Isse route file CHHOTA aur CLEAN rehta hai, aur ye function khud test ho sakta hai.

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger');

function makeToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

exports.signup = async (req, res) => {
  const email = req.body.email.toLowerCase().trim();
  const { password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });

  logger.info(`New user signed up: ${email}`); // CONCEPT: important events log karte hain
  res.status(201).json({ message: 'Signup successful', token: makeToken(user._id) });
};

exports.login = async (req, res) => {
  const email = req.body.email.toLowerCase().trim();
  const { password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    logger.warn(`Failed login attempt for: ${email}`);
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    logger.warn(`Failed login attempt for: ${email}`);
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  logger.info(`User logged in: ${email}`);
  res.status(200).json({ message: 'Login successful', token: makeToken(user._id) });
};
