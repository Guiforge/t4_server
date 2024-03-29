const models = require('../models/models.js');
const logger = require('../utils/logger');

const { Data } = models;

// do streaming to save
module.exports = async function upload(data) {
  try {
    const dataObj = new Data(data);
    await dataObj.save();
    logger.debug(`save ${dataObj.id}`);
    return dataObj;
  } catch (error) {
    logger.error(`Error upload: ${error}`);
    throw error;
  }
};
