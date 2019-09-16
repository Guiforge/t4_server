// const logger = require('../utils/logger');
const models = require('../models/models.js');

async function checkOwner(id, owner) {
  if (!id || !owner) {
    return false;
  }
  try {
    const realOwner = await models.getOwner(id);
    return Buffer.compare(Buffer.from(realOwner), Buffer.from(owner)) === 0;
  } catch (err) {
    return false;
  }
}

module.exports = {
  checkOwner
};
