const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const RateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const io = require('socket.io');

const initCron = require('./src/cron');
// var server = require('http').createServer(app);
// var io = require('socket.io')(server);
// const jwt = require('express-jwt');

const config = require('./src/config/index');
const initEndpoints = require('./src/routes/routes');
const logger = require('./src/utils/logger');
const initMiddle = require('./src/middlewares/middlewares');
const dbConnect = require('./src/utils/dbConnect'); // connect database

dbConnect().then(db => {
  // App
  const app = express();
  app.enable('trust proxy');

  const server = http.createServer(app);
  const socketServer = io(server);
  app.socketServer = socketServer;
  app.db = db;

  app.use(new RateLimit(config.rate));
  app.use(cors());
  app.use(compression());
  app.use(helmet());
  app.use(helmet.hidePoweredBy());
  app.use(express.json({ limit: '3gb' }));
  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true }));

  initMiddle(app);
  initEndpoints(app);

  // app.listen(config.api.PORT, config.api.HOST);
  server.listen(config.api.PORT);
  logger.info(`Running on http://${config.api.HOST}:${config.api.PORT}`);
  initCron(app);
  /* process.on('SIGINT', function(){
    mongoose.connection.close(function(){
      console.log("Mongoose default connection is disconnected due to application termination");
       process.exit(0);
      });
}); */
});
