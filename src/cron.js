const Cron = require('node-cron');
const logger = require('./utils/logger');
const clean = require('./utils/clean');

function initCron(app) {
  Cron.schedule('1 0 * * * ', () => {
    logger.debug('Start Clean !');
    clean(app);
    logger.debug('End Clean !');
  });
}

module.exports = initCron;
