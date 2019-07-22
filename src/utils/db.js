const mongoose = require('mongoose');

const config = require('../config/index');
const logger = require('./logger');

mongoose.Promise = global.Promise;

logger.info(config.db.uri);
const connection = mongoose.connect(config.db.uri, { useNewUrlParser: true });

connection
  .then(db => {
    logger.info(
      `Successfully connected to ${config.db.uri} MongoDB cluster in ${config.env} mode.`
    );
    return db;
  })
  .catch(err => {
    logger.error('Error while attempting to connect to database:');
    logger.error(err);
  });

module.exports = connection;
