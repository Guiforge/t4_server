const auth = require('./auth');

function initMiddle(app) {
  app.post(auth.middleCheckNonceRoutesPOST, auth.middleCheckNonce);
}

module.exports = initMiddle;
