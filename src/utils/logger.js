const winston = require('winston');
const config = require('../config/index.js');

// eslint-disable-next-line new-cap
const logger = new winston.createLogger({
  format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  transports: [
    new winston.transports.File(config.logger.file),
    new winston.transports.Console(config.logger.console)
  ],
  exitOnError: false
});

module.exports = logger;
