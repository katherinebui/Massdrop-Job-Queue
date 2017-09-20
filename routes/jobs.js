'use strict';

const job = require('../queue/jobs');
const valid = require('url-valid');

const routes = require('express').Router();

const app = require('../app');

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello! Are you ready?' });
});

// grabs the url, checks whether it is a valid url and creates a new job
routes.post('/create/:url', (req, res) => {
  const url = 'http://' + req.params.url;

  if(job.validInput(url)) {
    job.create(url, req, res);
    console.log('yes')
  } else {
    console.log('oh no')
  }
})

// grabs the id and uses it to check the status of the job
routes.get('/:id/status', (req, res) => {
  const id = req.params.id;
  job.requestStatus(id, res);
})

module.exports = routes;
