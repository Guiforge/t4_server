const auth = require('./auth');

function initMiddle(app) {
  app.get(auth.middleCheckNonceRoutes, auth.middleCheckNonce);
  app.delete(auth.middleCheckOwnerRoutes, auth.middleCheckOwner);
  app.get(auth.middleCheckDownRoutes, auth.middleCheckDown);
}

module.exports = initMiddle;
