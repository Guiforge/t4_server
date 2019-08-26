const auth = require('./auth');

function initMiddle(app) {
  app.get(auth.middleCheckNonceRoutes, auth.middleCheckNonce);
}

module.exports = initMiddle;
