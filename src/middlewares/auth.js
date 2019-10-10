const crypto = require('crypto');
const models = require('../models/models.js');
const logger = require('../utils/logger');
const routes = require('../config/route');

const { Data } = models;

async function checkNonce(id, signNonce) {
  if (!id || !signNonce) {
    return false;
  }
  const nonce = await models.getNonce(id);
  const signKey = Buffer.from(await models.getSignKey(id));
  const hmac = crypto.createHmac('sha256', signKey);
  hmac.write(nonce);
  hmac.end();
  const signNonceReal = hmac.read();
  return Buffer.compare(Buffer.from(signNonce.data), signNonceReal) === 0;
}

function middleCheckNonce(req, res, next) {
  try {
    const { id } = req.params;
    const signNonce = req.get('signNonce');
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
    res.sendStatus(404);
  }
}

async function checkOwner(id, owner) {
  if (!id || !owner) {
    return false;
  }
  const realOwner = await models.getOwner(id);
  return Buffer.compare(Buffer.from(realOwner), Buffer.from(owner)) === 0;
}

function middleCheckOwner(req, res, next) {
  try {
    const { id } = req.params;
    const owner = req.get('owner');
    checkOwner(id, owner)
      .then(isSameOwner => {
        if (isSameOwner) {
          next();
        } else {
          res.sendStatus(401);
        }
      })
      .catch(err => {
        logger.error('error check Owner', err);
        res.sendStatus(404);
      });
  } catch (error) {
    res.sendStatus(404);
  }
}

// middleware with app
function getAppMiddle(app) {
  return {
    middleCheckDown(req, res, next) {
      try {
        const { id } = req.params;
        Data.findById(id).then(metaDoc => {
          if (!metaDoc || metaDoc.down <= 0) {
            res.sendStatus(404);
            models.cleanOne(id, app);
          } else {
            next();
          }
        });
      } catch (error) {
        res.sendStatus(404);
      }
    },
    middleCheckDate(req, res, next) {
      try {
        const { id } = req.params;
        Data.findById(id).then(metaDoc => {
          if (!metaDoc || metaDoc.days < Date.now()) {
            res.sendStatus(404);
            models.cleanOne(id, app);
          } else {
            next();
          }
        });
      } catch (error) {
        res.sendStatus(404);
      }
    }
  };
}

module.exports = {
  getAppMiddle,
  middleCheckDownRoutes: [routes.download, routes.getMeta, routes.infoFile],
  middleCheckDateRoutes: [routes.download, routes.getMeta, routes.infoFile],
  middleCheckOwner,
  middleCheckOwnerRoutes: [routes.delete, routes.infoFile],
  middleCheckNonce,
  middleCheckNonceRoutes: [routes.download, routes.getMeta]
};
