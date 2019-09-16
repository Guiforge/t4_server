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
    Data.findById(id, 'enc ivMeta', (err, meta) => {
      if (err || !meta) {
        reject();
      } else {
        resolve({ enc: meta.toObject().enc, ivMeta: meta.toObject().ivMeta });
      }
    });
  });
}

async function getSignKey(id) {
  logger.debug(`Ask key for : ${id}`);
  return new Promise((resolve, reject) => {
    Data.findById(id, 'keyAuth', (err, key) => {
      if (err || !key) {
        reject();
      } else {
        resolve(key.toObject().keyAuth.buffer);
      }
    });
  });
}

async function getOwner(id) {
  logger.debug(`Ask owner for : ${id}`);
  return new Promise((resolve, reject) => {
    Data.findById(id, 'owner', (err, data) => {
      if (err || !data) {
        reject();
      } else {
        resolve(data.toObject().owner);
      }
    });
  });
}

// deprecated
async function getFile(id) {
  logger.debug('DEPRECATED !!!!!');
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
  getFile,
  getOwner
};
