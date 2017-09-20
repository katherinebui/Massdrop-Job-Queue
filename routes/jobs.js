'use strict';

const job = require('../queue/jobs');
const valid = require('url-valid');
const request = require('request');

const routes = require('express').Router();

const app = require('../app');

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello! Are you ready?' });
});

// grabs the url, checks whether it is a valid url and creates a new job
routes.post('/create/:url', (req, res, err) => {
  const url = 'http://' + req.params.url;

// npm packages to check for valid url had lots of issues, so I switched to validating the url by making a request to the url to check if is valid
  request(url,  (request, response, err) => {
    if (response.statusCode == 200) {
      console.log(url + ' is a valid url');
      job.create(url, res);
    } else {
      console.log(url + ' is not a valid url')
      console.log(err);
    }
  })
})

// grabs the id and uses it to check the status of the job
routes.get('/:id/status', (req, res) => {
  const id = req.params.id;
  job.requestStatus(id, res);
})

module.exports = routes;
