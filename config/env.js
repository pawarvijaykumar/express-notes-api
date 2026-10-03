// CONCEPT: CENTRALIZED ENV CONFIG - saari env variables ek jagah se access
// karte hain, taaki poori codebase me process.env.X bikhra na ho, aur
// missing variable turant pakad me aaye (app start hote hi, baad me nahi).

function required(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env variable: ${name}`);
    process.exit(1);
  }
  return value;
}

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: required('MONGO_URI'),
  JWT_SECRET: required('JWT_SECRET'),
  isProduction: process.env.NODE_ENV === 'production',
};
