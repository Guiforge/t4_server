const { download } = require('../controllers/controllers');
const routes = require('../config/route');
const logger = require('../utils/logger');
const socketUpload = require('../controllers/socketUpload');
const Data = require('../models/data');
const models = require('../models/models');

const initEndpoints = app => {
  app.get(routes.getNonce, async (req, res) => {
    const { id } = req.params;
    logger.debug(`log ask nonce :${id}`);
    const nonce = await download.getNonce(id);
    if (!nonce) {
      res.sendStatus(404);
    } else {
      res.status(200);
      res.send({ nonce });
    }
  });

  app.get(routes.getMeta, async (req, res) => {
    const { id } = req.params;
    logger.debug(`log ask meta :${id}`);
    const meta = await download.getMeta(id);
    if (!meta) {
      res.sendStatus(404);
    } else {
      logger.debug(`meta existe :${id}`);
      res.status(200);
      res.send({ meta });
    }
  });

  app.get(routes.download, async (req, res) => {
    try {
      const { id } = req.params;
      const meta = await Data.findById(id);
      // eslint-disable-next-line operator-assignment
      meta.down = meta.down - 1;
      await meta.save();
      const downloadStream = app.db.gridFSBucket.openDownloadStreamByName(id);
      downloadStream.pipe(res);
    } catch (error) {
      res.sendStatus(404);
    }
  });

  app.delete(routes.delete, async (req, res) => {
    try {
      const { id } = req.params;
      logger.debug(`log ask delete id: :${id}`);
      models.cleanOne(id, app);
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(404);
    }
  });

  app.get(routes.download404, async (req, res) => {
    res.sendStatus(404);
  });

  app.socketServer.on('connection', socket => {
    socketUpload(app, socket);
  });

  app.get(routes.infoFile, async (req, res) => {
    try {
      const { id } = req.params;
      Data.findById(id, 'down days', (err, meta) => {
        if (err) {
          res.sendStatus(404);
        } else {
          res.status(200);
          res.send({ down: meta.down, days: meta.days });
        }
      });
    } catch (error) {
      res.sendStatus(404);
    }
  });
};

module.exports = initEndpoints;
