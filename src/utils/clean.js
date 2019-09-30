const { Data } = require('../models/models.js');
const logger = require('../utils/logger');

async function clean(app) {
  try {
    const query = Data.find(
      {
        $or: [
          {
            days: { $lt: Date.now() }
          },
          {
            down: { $lte: 0 }
          }
        ]
      },
      {
        _id: 1
      });
    let ids = await query.exec();
    if (!ids) {
      return ;
    }
    // eslint-disable-next-line no-underscore-dangle
    ids = ids.map(obId => obId._id);
    Data.deleteMany({ _id: { $in: ids } }, err => {
      logger.error('Clean function', err);
    });
    ids = ids.map(v => v._id.toString())

    const find = app.db.gridFSBucket.find({filename: { $in: ids } })
    find.forEach((file) => {
      logger.debug('file', file)
      app.db.gridFSBucket.delete(file._id).catch((err) => {
        logger.error({fileId: file._id, err})
      })
    })
  } catch (error) {
    if (error) {
      logger.error('Clean function', {error});
    }
  }
}

module.exports = clean;
