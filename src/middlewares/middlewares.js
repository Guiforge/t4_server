const auth = require('./auth');

function initMiddle(app) {
  app.get(auth.middleCheckNonceRoutes, auth.middleCheckNonce);
  app.delete(auth.middleCheckOwnerRoutes, auth.middleCheckOwner);
  app.get(auth.middleCheckOwnerRoutes, auth.middleCheckOwner);
  app.get(auth.middleCheckDownRoutes, auth.getAppMiddle(app).middleCheckDown);
  app.get(auth.middleCheckDateRoutes, auth.getAppMiddle(app).middleCheckDate);
}

module.exports = initMiddle;
