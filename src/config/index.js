const db = require('./db');
const rate = require('./rate');
const jwt = require('./jwt');
const api = require('./api');
const logger = require('./logger');

module.exports = {
  db,
  rate,
  jwt,
  api,
  logger
};
