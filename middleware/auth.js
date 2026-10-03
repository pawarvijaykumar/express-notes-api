// CONCEPT: AUTH MIDDLEWARE - protected routes se pehle chalta hai.
// Token sahi hai to req.userId set karke aage jaane deta hai, warna 401.
const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  // Header aisa aata hai:  Authorization: Bearer <token>
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token missing. Please login.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET); // galat/expired ho to throw karega
    req.userId = payload.id; // aage ke routes ko pata chal jaayega ki kaun user hai
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};