// CONCEPT: APP vs SERVER - ye file sirf Express app BANATI hai (routes, middleware).
// Isme app.listen() NAHI hai. Isse Jest/Supertest is app ko directly test kar sakte
// hain bina asli port 3000 open kiye. server.js alag se isko "start" karta hai.

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const { graphqlHTTP } = require('express-graphql');

const logger = require('./config/logger');
const { generalLimiter, authLimiter } = require('./middleware/rateLimiter');
const authRouter = require('./routes/auth');
const notesRouter = require('./routes/notes');
const graphqlSchema = require('./graphql/schema');
const graphqlRoot = require('./graphql/resolvers');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(generalLimiter);
app.use('/uploads', express.static('uploads'));

app.use('/api/v1/auth', authLimiter, authRouter);
app.use('/api/v1/notes', notesRouter);

app.use('/graphql', graphqlHTTP((req) => {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');
  let userId = null;
  if (type === 'Bearer' && token) {
    try {
      userId = jwt.verify(token, process.env.JWT_SECRET).id;
    } catch (err) {}
  }
  return { schema: graphqlSchema, rootValue: graphqlRoot, context: { userId }, graphiql: true };
}));

app.get('/', (req, res) => {
  res.send('Notes API. REST: /api/v1 | GraphQL: /graphql');
});

app.use((err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  if (err.name === 'MulterError' || err.message.includes('Only image files')) {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid id format' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Already exists' });
  }
  res.status(500).json({
    error: 'Something went wrong',
    ...(process.env.NODE_ENV !== 'production' && { detail: err.message }),
  });
});

module.exports = app;
