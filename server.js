const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);



require('dotenv').config();

const env = require('./config/env');
const logger = require('./config/logger');
const connectDB = require('./config/db');
const app = require('./app');

connectDB();

app.listen(env.PORT, () => {
  logger.info(`Server chal raha hai: http://localhost:${env.PORT}`);
  console.log(`Server chal raha hai: http://localhost:${env.PORT}`);
  console.log(`REST API: http://localhost:${env.PORT}/api/v1`);
  console.log(`GraphQL:  http://localhost:${env.PORT}/graphql`);
});
