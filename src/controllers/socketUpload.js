const { Readable } = require('stream');
const logger = require('../utils/logger');
const { upload } = require('../controllers/controllers');

module.exports = (app, socket) => {
  let writeStream;
  let inStream;
  let dataObj;

  function removeUseless() {
    if (dataObj) {
      dataObj.remove();
    }
    if (writeStream && !writeStream.destroyed) {
      writeStream.destroy();
      app.db.gridFSBucket.delete(writeStream.id);
    }
    if (inStream && !inStream.destroy) {
      inStream.destroy();
    }
    writeStream = undefined;
    inStream = undefined;
    dataObj = undefined;
  }

  function sendErrorDisconnect(msg) {
    try {
      removeUseless();
    } catch (error) {
      logger.error(error);
    } finally {
      // change envent error to err
      socket.emit('error', msg);
      socket.close(true);
    }
  }

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
        sendErrorDisconnect('Error in upload meta');
      }
    } else {
      sendErrorDisconnect('only one file at time');
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
      sendErrorDisconnect('Send meta and file before');
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
        sendErrorDisconnect(error);
      }
    }
  });
  // +++++++++++++++++++++++++++++++++++++++++++++
};