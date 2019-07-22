const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const RateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('express-jwt');

const config = require('./src/config/index');
const initEndpoints = require('./endpoints');
const logger = require('./src/utils/logger');
require('./src/utils/db');

// App
const app = express();
app.enable('trust proxy');

app.use(new RateLimit(config.rate));
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(express.json({ limit: '300kb' }));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// ignore authentication on the following routes
app.use(
  jwt({ secret: config.jwt.secret }).unless({
    path: ['/', '/auth/signup', '/auth/login', '/auth/forgot-password', '/auth/reset-password']
  })
);

// throw an error if a jwt is not passed in the request
app.use((err, req, res, next) => {
  logger.debug('SALUT');
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Missing authentication credentials.');
  }
  next();
});

initEndpoints(app);

app.listen(config.api.PORT, config.api.HOST);
logger.info(`Running on http://${config.api.HOST}:${config.api.PORT}`);
