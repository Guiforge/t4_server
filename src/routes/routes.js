const { Readable } = require('stream');
const { upload } = require('../controllers/controllers');
const { download } = require('../controllers/controllers');
const routes = require('../config/route');
const logger = require('../utils/logger');

const initEndpoints = app => {
  // app.post(routes.uploadMeta, async (req, res) => {
  //   try {
  //     const { id, owner } = await upload(req.body);
  //     res.status(200);
  //     res.send({ id, owner });
  //   } catch (error) {
  //     logger.error('error upload:', error);
  //     res.status(400);
  //     res.send({ Error: 'Error' });
  //   }
  // });

  // app.put(routes.uploadAuthTag, async (req, res) => {
  //   res.status(200);
  //   res.send('OK');
  // });

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

  // on error or disconnect before send authtag suppr file
  app.socketServer.on('connection', socket => {
    let writeStream;
    let inStream;
    let dataObj;

    // Upload Meta ++++++++++++++++++++++++++++++++
    socket.on('meta', async meta => {
      if (!writeStream && !dataObj) {
        try {
          logger.debug('meta:', meta);
          dataObj = await upload(meta);

          // init for file
          writeStream = app.db.gridFSBucket.openUploadStream(dataObj.id);
          inStream = new Readable({
            read() {}
          });
          inStream.pipe(writeStream);

          socket.emit('meta', { id: dataObj.id, owner: dataObj.owner });
        } catch (error) {
          socket.emit('error', 'Error in upload meta');
        }
      } else {
        socket.emit('error', 'only one file at time');
      }
    });
    // +++++++++++++++++++++++++++++++++++++++++++++

    // Upload File +++++++++++++++++++++++++++++++++
    socket.on('chunk', chunk => {
      if (!inStream) {
        socket.error('error', 'Send meta before file');
      } else {
        inStream.push(chunk);
      }
    });
    // +++++++++++++++++++++++++++++++++++++++++++++

    // AuthTag +++++++++++++++++++++++++++++++++++++
    socket.on('authTag', async authTag => {
      if (!dataObj || !inStream) {
        socket.emit('error', 'Send meta and file before');
      } else {
        try {
          inStream.push(null);
          dataObj.set('authTag', authTag);
          logger.debug(dataObj.authTag);
          await dataObj.save();
          socket.emit('authTag', 'Ok');
          writeStream = undefined;
          inStream = undefined;
          dataObj = undefined;
        } catch (error) {
          socket.emit('error', error);
        }
      }
    });
    // +++++++++++++++++++++++++++++++++++++++++++++
  });
};

module.exports = initEndpoints;
