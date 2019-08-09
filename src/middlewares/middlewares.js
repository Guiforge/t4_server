const auth = require('./auth');

function initMiddle(app) {
  app.use(auth.middleCheckNonceRoute, auth.middleCheckNonce);
}

module.exports = initMiddle;
