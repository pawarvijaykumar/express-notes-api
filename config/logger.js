// CONCEPT: WINSTON LOGGER - saare logs ek jagah se banate hain, alag-alag
// "transports" (destinations) me bhej sakte hain - console, file, etc.

const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // file me structured JSON format me save hoga
  ),
  transports: [
    // saare logs (info, warn, error) is file me
    new winston.transports.File({ filename: 'logs/combined.log' }),
    // SIRF errors is alag file me - taaki jaldi dhoondh sako
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});

// CONCEPT: development me console me bhi dikhao (readable format me),
// production me sirf file me (console spam na ho)
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

module.exports = logger;
