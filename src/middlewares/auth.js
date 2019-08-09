const crypto = require('crypto');
const models = require('../models/models.js');
const logger = require('../utils/logger');

async function checkNonce(id, signNonce) {
  if (!id || !signNonce) {
    return false;
  }
  try {
    const nonce = await models.getNonce(id);
    const signKey = await models.getSignKey(id);
    const keyObj = crypto.createSecretKey(Buffer.from(signKey));
    return crypto.verify('HMAC', nonce, keyObj, signNonce);
  } catch (err) {
    return false;
  }
}

function middleCheckNonce(req, res, next) {
  const { id } = req.params;
  const { signNonce } = req.params;
  checkNonce(id, signNonce)
    .then(isAuth => {
      if (isAuth) {
        next();
      } else {
        res.sendStatus(401);
      }
    })
    .catch(err => {
      logger.error(err);
      res.sendStatus(404);
    });
}

module.exports = {
  middleCheckNonce,
  middleCheckNonceRoute: '/download/:id([0-9a-fA-F]{24})'
};
