'use strict';

const job = require('../queue/jobs');
const validURL = require('valid-url');

const routes = require('express').Router();

const app = require('../app');

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

routes.get('/create/:url', (req, res) => {
  const url = req.params.url;

  if(validURL.isUri('http://' + url)){
    console.log('url looks valid!');
    job.createJob(url, res);
  } else {
    console.log('This is not a valid url')
  }
})

module.exports = routes;
