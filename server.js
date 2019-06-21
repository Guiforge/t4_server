'use strict';

const express = require('express');
const initEndpoints = require('./endpoints');
const swaggerDoc = require('./swaggerDoc');
var helmet = require('helmet')

// Constants
const PORT = 8070;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(helmet());
app.use(express.json({ limit: '300kb' }));
initEndpoints(app);
swaggerDoc(app);


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);