'use strict';

// const job = require('../queue/jobs');
const validURL = require('valid-url');

const routes = require('express').Router();

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

// routes.get('/create', (req, res) => {
//   res.status(200).json({ message: 'create connected' });
// });

routes.get('/create/:url', (req, res) => {
  const url = req.params.url;

  if(validURL.isUri('http://' + url)){
    console.log('url looks valid!');
  } else {
    console.log('not a valid url dude!')
  }
  // res.send('this be the url dude: ' + req.params.url);
})


module.exports = routes;
