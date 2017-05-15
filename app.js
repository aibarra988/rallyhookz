'use strict';
const bodyParser = require('body-parser');
const app = require('express')();
const routes = require('./routes');

app.use(bodyParser.json());

app.use(routes);

module.exports = app;