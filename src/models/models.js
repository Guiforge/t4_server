const Data = require('./data');
const logger = require('../utils/logger');

async function getNonce(id) {
  logger.log(`Ask nonce for : ${id}`);
  return new Promise((resolve, reject) => {
    Data.findById(id, 'nonce', (err, nonce) => {
      if (err || !nonce) {
        reject();
      } else {
        resolve(nonce);
      }
    });
  });
}

async function getSignKey(id) {
  logger.log(`Ask key for : ${id}`);
  return new Promise((resolve, reject) => {
    Data.findById(id, 'key', (err, key) => {
      if (err || !key) {
        reject();
      } else {
        resolve(key);
      }
    });
  });
}

module.exports = {
  Data,
  getNonce,
  getSignKey
};
