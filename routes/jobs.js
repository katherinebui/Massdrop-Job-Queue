'use strict';

const job = require('../queue/jobs');
const validURL = require('valid-url');

const routes = require('express').Router();

const app = require('../app');

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello! Are you ready?' });
});

routes.post('/create/:url', (req, res) => {
  const url = req.params.url;

  if(validURL.isUri('http://' + url)){
    console.log('URL looks valid!');
    job.create(url, res);
  } else {
    console.log('This is not a valid url');
  }
})

routes.get('/:id/status', (req, res) => {
  const id = req.params.id;
  const p = job.requestStatus(id, res);
})

module.exports = routes;
