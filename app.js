'use strict';

const express = require('express');
const kue = require('kue');
const logger = require('morgan');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const redis = require('redis');

const app = express();
const router = express.Router();
app.use(router);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), () => {
  console.log('Server listening on port: ', app.get('port'));
});

const client = redis.createClient();
const queue = kue.createQueue();

client.on('connect', () =>{
  console.log('Redis connection established!');
})

client.on('error', (err) => {
  console.log('An error has occurred: ' + err);
})

queue.on('ready', () => {
  console.log('Queue is ready!')
});

queue.on('error', (err) => {
  console.log('There was an log in the main queue!');
  console.log(err);
})

app.get('/create', (req, res) => {
  // res.send('this be the url dude: ' + req.param('url'))
})


module.exports = app;

