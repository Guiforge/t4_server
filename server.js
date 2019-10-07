const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const RateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const http = require('http');
const io = require('socket.io');

const initCron = require('./src/cron');
const config = require('./src/config/index');
const initEndpoints = require('./src/routes/routes');
const logger = require('./src/utils/logger');
const initMiddle = require('./src/middlewares/middlewares');
const dbConnect = require('./src/utils/dbConnect'); // connect database
const clean = require('./src/utils/clean');

dbConnect().then(db => {
  const app = express();
  app.enable('trust proxy');

  const server = http.createServer(app);
  const socketServer = io(server);
  app.socketServer = socketServer;
  app.db = db;

  app.use(new RateLimit(config.rate));
  app.use(compression());
  app.use(helmet());
  app.use(helmet.hidePoweredBy());
  app.use(express.json({ limit: '3kb' }));
  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true }));

  initMiddle(app);
  initEndpoints(app);
  initCron(app);
  clean(app);
  server.listen(config.api.PORT);
  logger.info(`Running on http://${config.api.HOST}:${config.api.PORT}`);

  process.on('SIGINT', () => {
    // eslint-disable-next-line func-names
    db.close(function() {
      logger.debug('Mongoose default connection is disconnected due to application termination');
      process.exit(0);
    });
  });
});
