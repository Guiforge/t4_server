/* eslint-disable no-underscore-dangle */
const { Data } = require('../models/models.js');
const logger = require('../utils/logger');

async function clean(app) {
  try {
    const limitDate = new Date(Date.now());
    limitDate.setDate(limitDate.getDate() - 11);
    // get meta with limit day < now && creationDate < 11
    const query = Data.find(
      {
        $or: [
          {
            days: { $lt: Date.now() }
          },
          {
            down: { $lte: 0 }
          },
          {
            creationDate: { $lt: limitDate }
          }
        ]
      },
      {
        _id: 1
      }
    );
    let ids = await query.exec();
    if (!ids) {
      return;
    }
    // eslint-disable-next-line no-underscore-dangle
    ids = ids.map(obId => obId._id);
    Data.deleteMany({ _id: { $in: ids } });
    ids = ids.map(v => v._id.toString());

    const find = await app.db.gridFSBucket.find({
      $or: [
        { filename: { $in: ids } },
        {
          uploadDate: { $lt: limitDate }
        }
      ]
    });
    find.forEach(file => {
      logger.debug('file', file);
      app.db.gridFSBucket.delete(file._id).catch(err => {
        logger.error('error in clean all files', { fileId: file._id, err });
      });
    });
  } catch (error) {
    if (error) {
      logger.error('Clean function', error);
    }
  }
}

module.exports = clean;
