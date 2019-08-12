// const crypto = require('crypto');
// const logger = require('../utils/logger');
const models = require('../models/models.js');

async function getNonce(id) {
  try {
    const nonce = await models.getNonce(id);
    return nonce;
  } catch (err) {
    return false;
  }
}

async function getMeta(id) {
  try {
    const meta = await models.getMeta(id);
    return meta;
  } catch (err) {
    return false;
  }
}

async function getFile(id) {
  try {
    const meta = await models.getFile(id);
    return meta;
  } catch (err) {
    return false;
  }
}

module.exports = {
  getNonce,
  getMeta,
  getFile
};
