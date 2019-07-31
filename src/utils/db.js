const mongoose = require('mongoose');

const config = require('../config/index');
const logger = require('./logger');


logger.debug(`Try to connect: ${config.db.uri}`)
mongoose.connect(config.db.uri, { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/*async function connect() {
  logger.info(config.db.uri);
  try {
    const connection = await mongoose.connect(config.db.uri, {
      useNewUrlParser: true
    });
    logger.info('Connect to database')
    return connection
  } catch (error) {
    logger.error('Error while attempting to connect to database:');
    logger.error(error);
    throw error
  }
}*/


module.exports = db;