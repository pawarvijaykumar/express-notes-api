// CONCEPT: VALIDATION MIDDLEWARE - route ke andar har baar if-check likhne
// ki jagah, ek reusable middleware banaya jo kisi bhi schema ke saath kaam kare.

module.exports = function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};
