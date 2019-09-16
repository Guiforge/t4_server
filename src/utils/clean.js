const { Data } = require('../models/models.js');
const logger = require('../utils/logger');

async function clean(app) {
  try {
    const query = Data.find({ days: { $lt: Date.now() } }, { _id: 1 });
    let ids = await query.exec();
    // eslint-disable-next-line no-underscore-dangle
    ids = ids.map(obId => obId._id);
    Data.deleteMany({ _id: { $in: ids } }, err => {
      logger.error('Clean function', err);
    });
    // TODO supress file with ids
    // app.db.
  } catch (error) {
    logger.error('Clean function', error);
  }
}

module.exports = clean;
