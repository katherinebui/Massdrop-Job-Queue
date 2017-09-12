'use strict';

const router = require('express').Router();
const job = require('../queue/jobs');
const validURL = require('valid-url');

router.post('/', (req, res) => {

  if(validURL.isHttpUri('http://' + req.params['url'])){
    createJob('http://' + req.params['url'], res);
    return res.json({
        error: null,
        success: true,
        message: 'Successfully created job',
        jobInfo
      });
  } else {
    return res.json({
        error: err,
        success: false,
        message: 'Could not create job',
      });
  }
});

module.exports = router;

