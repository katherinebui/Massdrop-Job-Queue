'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const routes = require('./routes/jobs');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

app.use('/', routes);
app.use('/create', routes);

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), () => {
  console.log('Server listening on port: ', app.get('port'));
});

module.exports = app;

