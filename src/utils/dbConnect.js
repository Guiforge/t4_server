const mongoose = require('mongoose');
const config = require('../config/index');
const logger = require('./logger');

async function connect() {
  return new Promise((resolve, reject) => {
    try {
      logger.debug(`Try to connect to the Database`);
      let gridFSBucket;
      mongoose.connect(config.db.uri, { useNewUrlParser: true });
      mongoose.connection.on('error', error => logger.error(`MongoDB connection error:${error}`));
      mongoose.connection.once('connected', () => {
        logger.debug('Connect OK');
        gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
        resolve({ conn: mongoose.connection, gridFSBucket });
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = connect;
