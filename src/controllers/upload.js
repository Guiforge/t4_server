const models = require('../models/models.js');
const logger = require('../utils/logger');

function objToArray(obj) {
  const arr = [];
  Object.keys(obj).map(objectKey => {
    arr.push(obj[Number(objectKey)]);
  });
  return arr;
}

const { Data } = models;
module.exports = async function upload(data) {
  try {
    const dataObj = new Data(data);
    dataObj.enc.file = objToArray(data.enc.file);
    dataObj.enc.meta = objToArray(data.enc.meta);
    dataObj.key = objToArray(data.key);
    logger.debug(dataObj);
    await dataObj.save();
    return dataObj.id;
  } catch (error) {
    logger.error(`Error upload: ${error}`);
    throw error;
  }
};
