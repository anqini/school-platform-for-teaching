/*jshint esversion: 8*/

const express = require('express');
const winston = require('winston');
const app = express();

require('./startup/logging')();
require('./startup/conn')();
require('./startup/routes')(app);
require('./startup/config')();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));