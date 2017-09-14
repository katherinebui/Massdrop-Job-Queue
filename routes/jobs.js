// 'use strict';

// const job = require('../queue/jobs');
// const validURL = require('valid-url');

// const express = require('express')
// const router = express.Router();

// router.get('/create', (req, res) => {
//   res.send('this be the url dude: ' + req.params);
// })

// module.exports = router;



const routes = require('express').Router();

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

routes.get('/create', (req, res) => {
  res.status(200).json({ message: 'create connected' });
});

module.exports = routes;
