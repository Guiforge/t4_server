const { upload } = require('../controllers/controllers');
const { download } = require('../controllers/controllers');
const routes = require('../config/route');
const logger = require('../utils/logger');

const initEndpoints = app => {
  app.post(routes.upload, async (req, res) => {
    try {
      const { id, owner } = await upload(req.body);
      res.status(200);
      res.send({ id, owner });
    } catch (error) {
      logger.error('error upload:', error);
      res.status(400);
      res.send({ Error: 'Error' });
    }
  });

  app.get(routes.getNonce, async (req, res) => {
    const { id } = req.params;
    logger.debug(`log:${id}`);
    const nonce = await download.getNonce(id);
    logger.debug(`log:${nonce}`);
    if (!nonce) {
      res.sendStatus(404);
    } else {
      res.status(200);
      res.send({ nonce });
    }
  });

  app.get(routes.getMeta, async (req, res) => {
    const { id } = req.params;
    logger.debug(`log:${id}`);
    const meta = await download.getMeta(id);
    logger.debug(`log:${meta}`);
    if (!meta) {
      res.sendStatus(404);
    } else {
      res.status(200);
      res.send({ meta });
    }
  });

  app.get(routes.download, async (req, res) => {
    const { id } = req.params;

    res.status(200);
    res.send({ id });
  });

  app.get(routes.download404, async (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = initEndpoints;
