// CONCEPT: Express 4 async routes ke errors khud nahi pakadta.
// Ye wrapper error ko next(err) se error-handling middleware tak bhej deta hai,
// taaki server crash na ho aur client ko proper response mile.
module.exports = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
