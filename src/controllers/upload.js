const crypto = require('crypto');
const models = require('../models/models.js');
const logger = require('../utils/logger');

const { Data } = models;

// do streaming to save
module.exports = async function upload(data) {
  try {
    const dataPre = data;
    dataPre.owner = crypto.randomBytes(256).toString('hex');
    const dataObj = new Data(dataPre);
    logger.debug(`prepare to save! ${dataObj.id}`);
    await dataObj.save();
    logger.debug(`save ${dataObj.id}`);
    return { id: dataObj.id, owner: dataObj.owner };
  } catch (error) {
    logger.error(`Error upload: ${error}`);
    throw error;
  }
};
