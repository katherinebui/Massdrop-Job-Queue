'use strict';

const router = require('express').Router();
const job = require('../queue/jobs');

router.post('/', (req, res, next) => {
  const jobInfo = req.body;
  job.create(order, (err) => {
    if(err) {
      return res.json({
        error: err,
        success: false,
        message: 'Could not create job',
      });
    } else {
      return res.json({
        error: null,
        success: true,
        message: 'Successfully created job',
        jobInfo
      });
    }
  })
});

module.exports = router;

