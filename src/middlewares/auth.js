const crypto = require('crypto');
const models = require('../models/models.js');
const logger = require('../utils/logger');
const routes = require('../config/route');
const { checkOwner } = require('../controllers/file');

const { Data } = models;

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
  try {
    const { id } = req.params;
    const signNonce = req.get('signNonce');
    //   if (signNonce.length !== 188) {
    //     res.sendStatus(401);
    //     return;
    //   }
    const signNonceBuff = JSON.parse(Buffer.from(signNonce, 'base64').toString('ascii'));
    checkNonce(id, signNonceBuff)
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
  } catch (error) {
    res.sendStatus(401);
  }
}

function middleCheckOwner(req, res, next) {
  const { id } = req.get('id');
  const { owner } = req.get('owner');

  checkOwner(id, owner).then(isSameOwner => {
    if (isSameOwner) {
      next();
    } else {
      res.sendStatus(401);
    }
  });
}

  //middleware with app
  function getAppMiddle(app) {
    return {
      middleCheckDown(req, res, next) {
        const { id } = req.params;
        Data.findById(id).then((metaDoc) => {
          if (!metaDoc || metaDoc.down <= 0) {
            res.sendStatus(404);
            models.cleanOne(id, app)
          } else {
            next();
          }
        })
      }
    }
  }

module.exports = {
  getAppMiddle,
  middleCheckDownRoutes: [routes.download, routes.getMeta],
  middleCheckOwner,
  middleCheckOwnerRoutes: [routes.delete],
  middleCheckNonce,
  middleCheckNonceRoutes: [routes.download, routes.getMeta]
};
