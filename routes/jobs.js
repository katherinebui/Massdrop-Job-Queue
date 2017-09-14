'use strict';

const job = require('../queue/jobs');
const validURL = require('valid-url');

const routes = require('express').Router();

const app = require('../app');

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello! Are you ready?' });
});

routes.get('/create/:url', (req, res) => {
  const url = req.params.url;

  if(validURL.isUri('http://' + url)){
    console.log('url looks valid!');
    const j = job.create(url, res);
  } else {
    console.log('This is not a valid url');
  }
})

module.exports = routes;
