const Data = require('./data');
const logger = require('../utils/logger');

async function getNonce(id) {
  logger.debug(`Ask nonce for : ${id}`);
  return new Promise((resolve, reject) => {
    Data.findById(id, 'nonce', (err, nonce) => {
      if (err || !nonce) {
        reject();
      } else {
        resolve(nonce.toObject().nonce);
      }
    });
  });
}

async function getMeta(id) {
  logger.debug(`Ask meta for : ${id}`);
  return new Promise((resolve, reject) => {
    Data.findById(id, 'enc', (err, meta) => {
      if (err || !meta) {
        reject();
      } else {
        resolve(meta.toObject().enc.meta);
      }
    });
  });
}

async function getSignKey(id) {
  logger.debug(`Ask key for : ${id}`);
  return new Promise((resolve, reject) => {
    Data.findById(id, 'key', (err, key) => {
      if (err || !key) {
        reject();
      } else {
        resolve(key.toObject().key);
      }
    });
  });
}

async function getFile(id) {
  logger.debug(`Ask file for : ${id}`);
  return new Promise((resolve, reject) => {
    Data.findById(id, 'enc', (err, file) => {
      if (err || !file) {
        reject();
      } else {
        resolve(file.toObject().enc.file);
      }
    });
  });
}

module.exports = {
  Data,
  getNonce,
  getSignKey,
  getMeta,
  getFile
};
