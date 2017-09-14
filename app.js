'use strict';

const express = require('express');
const routes = require('./routes/jobs');
const logger = require('morgan');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const redis = require('redis');

const app = express();
const client = redis.createClient();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());

app.use('/', routes);
app.use('/create', routes);

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), () => {
  console.log('Server listening on port: ', app.get('port'));
});


client.on('connect', () =>{
  console.log('Redis connection established!');
})

client.on('error', (err) => {
  console.log('An error has occurred: ' + err);
})

module.exports = app;

