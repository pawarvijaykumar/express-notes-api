// CONCEPT: MIDDLEWARE - har request is function se guzarti hai pehle,
// route handler tak pahunchne se pehle. (req, res, next) teeno hamesha aate hain.

function requestLogger(req, res, next) {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.url}`);

  // CONCEPT: next() call karna ZAROORI hai, warna request yahi "atak" jaayegi
  // aur route handler tak kabhi nahi pahunchegi.
  next();
}

module.exports = requestLogger;
