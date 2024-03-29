const Data = require('./data');
const logger = require('../utils/logger');

async function getNonce(id) {
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
  return new Promise((resolve, reject) => {
    Data.findById(id, 'enc ivMeta sizeZip authTag', (err, meta) => {
      if (err || !meta) {
        reject();
      } else {
        const ret = {
          enc: meta.toObject().enc,
          ivMeta: meta.toObject().ivMeta,
          sizeZip: meta.toObject().sizeZip,
          authTag: meta.toObject().authTag
        };
        resolve(ret);
      }
    });
  });
}

async function getSignKey(id) {
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

async function cleanOne(id, app) {
  try {
    await Data.deleteOne({ _id: id });
    const idFiles = await app.db.gridFSBucket.find({ filename: id });
    idFiles.forEach(file => {
      // eslint-disable-next-line no-underscore-dangle
      app.db.gridFSBucket.delete(file._id).catch(err => {
        logger.error('cleanOne File', { id, err });
      });
    });
  } catch (error) {
    logger.error('cleanOne', { id, error });
  }
}

module.exports = {
  Data,
  getNonce,
  getSignKey,
  getMeta,
  getOwner,
  cleanOne
};
