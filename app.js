'use strict';

const express = require('express');
const kue = require('kue');
const path - require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const jobs = require('./routes/jobs');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use ('/queue', kue.app);
app.use('/routes')

module.exports = app;
