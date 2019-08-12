const crypto = require('crypto');
const models = require('../models/models.js');
const logger = require('../utils/logger');
const routes = require('../config/route');

async function checkNonce(id, signNonce) {
  if (!id || !signNonce) {
    return false;
  }
  try {
    const nonce = await models.getNonce(id);
    const signKey = Buffer.from(await models.getSignKey(id));
    const hmac = crypto.createHmac('sha256', signKey);
    hmac.write(nonce);
    hmac.end();
    const signNonceReal = hmac.read();
    return Buffer.compare(Buffer.from(signNonce.data), signNonceReal) === 0;
  } catch (err) {
    logger.debug('Error', err);
    return false;
  }
}

function middleCheckNonce(req, res, next) {
  const { id } = req.params;
  const { signNonce } = req.body;
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
  middleCheckNonceRoutesPOST: [routes.download, routes.getMeta]
};
