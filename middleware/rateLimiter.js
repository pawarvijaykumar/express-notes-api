// CONCEPT: RATE LIMITING - ek IP se bahut zyada requests aayein to block karo.
const rateLimit = require('express-rate-limit');

const isTest = process.env.NODE_ENV === 'test';
const skipInTest = (req, res, next) => next(); // CONCEPT: tests me rate limit ka koi matlab nahi, skip karo

const generalLimiter = isTest ? skipInTest : rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // is window me max 100 requests per IP
  message: { error: 'Too many requests, please try again later' },
});

const authLimiter = isTest ? skipInTest : rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // sirf 5 login/signup attempts per 15 min
  message: { error: 'Too many attempts, please try again after 15 minutes' },
});

module.exports = { generalLimiter, authLimiter };
