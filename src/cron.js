const Cron = require('node-cron');
const logger = require('./utils/logger');
const clean = require('./utils/clean');

function initCron(app) {
  Cron.schedule('1 0 * * * ', async () => {
    logger.debug('Start Clean !');
    await clean(app);
    logger.debug('End Clean !');
  });
}

module.exports = initCron;
