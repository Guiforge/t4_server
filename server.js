

const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const RateLimit = require('express-rate-limit');
const initEndpoints = require('./endpoints');
const swaggerDoc = require('./swaggerDoc');

const apiLimiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});

// Constants
const PORT = 8070;
const HOST = '0.0.0.0';

// App
const app = express();
app.enable('trust proxy');

app.use(compression());
app.use(apiLimiter);
app.use(helmet());
app.use(express.json({ limit: '300kb' }));

initEndpoints(app);
swaggerDoc(app);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
