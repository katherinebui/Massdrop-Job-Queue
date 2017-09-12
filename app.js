'use strict';

const express = require('express');
const kue = require('kue');
const path - require('path');

const jobs = require('./routes/jobs');

const app = express();

app.use ('/queue', kue.app);
app.use('/routes')
