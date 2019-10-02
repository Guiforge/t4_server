const { download } = require('../controllers/controllers');
const routes = require('../config/route');
const logger = require('../utils/logger');
const socketUpload = require('../controllers/socketUpload');
const Data = require('../models/data');

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
    const { id } = req.params;
    logger.debug(`log ask delete id: :${id}`);
    const objFile = app.db.fs.files.find({ filename: id });
    if (!objFile) {
      res.sendStatus(404);
    } else {
      logger.debug(`meta existe :${id} ${objFile.id}`);
      app.db.gridFSBucket.delete(objFile.id);
      const dataObj = Data.findById(id);
      dataObj.remove();
      res.sendStatus(200);
    }
  });

  app.get(routes.download404, async (req, res) => {
    res.sendStatus(404);
  });

  app.socketServer.on('connection', socket => {
    socketUpload(app, socket);
  });
};

module.exports = initEndpoints;
