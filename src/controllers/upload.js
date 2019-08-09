const models = require('../models/models.js');
const logger = require('../utils/logger');

const { Data } = models;

module.exports = async function upload(data) {
  try {
    const dataObj = new Data(data);
    logger.debug(`prepare to save! ${dataObj.id}`);
    await dataObj.save();
    logger.debug(`save ${dataObj.id}`);
    return dataObj.id;
  } catch (error) {
    logger.error(`Error upload: ${error}`);
    throw error;
  }
};
