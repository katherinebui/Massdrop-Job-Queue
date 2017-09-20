'use strict';

const request = require('request');
const app = require('../app');

require('events').EventEmitter.prototype._maxListeners = 100;

const axios = require('axios');
const kue = require('kue');
const queue = kue.createQueue();

const redis = require('redis');
const client = redis.createClient();

client.on('connect', () =>{
  console.log('Redis connection established');
})

client.on('error', (err) => {
  console.log('An error has occurred: ' + err);
})

// npm packages to check for valid url had lots of issues, so I switched to validating the url by making a request to the url to check if is valid
const validUrl = (data) => {
  request(data,  (err, res, body) => {
    if (!err && res.statusCode == 200) {
      console.log(data + ' is a valid url');
    } else {
      console.log(data + ' is not a valid url')
      console.log('error: ' + err);
    }
  })
}

// creates job in queue, if successful- will great a new key value pair in redis placing url into the db
const createJob = (data, req, res) => {
  let job = queue.create('job', data)
  .priority('high')
  .removeOnComplete(false)
  .on('completed', (result) => {
    console.log('Job completed with data ', result);
  })
  .on('failed', (errorMessage) => {
    console.log('Job failed');
  })
  .on('progress', (progress, data) => {
    console.log('\r  job #' + job.id + ' ' + progress + '% complete with data ', data);
  })
  .on('job enqueue', (id, type) => {
    console.log('Job %s got queued of type %s', id, type );
  })
  .save((err) => {
    if(!err){
      client.hset(job.id, data, 'none', redis.print);
      res.send({
        data: 'The URL you submitted was: ' + data,
        message: 'Successfully created job. Your job ID is ' + job.id,
        success: true
      });
    } else {
      res.send({
        message: 'Could not create job. Please check if input is valid URL',
        success: false,
        error: err
      });
    };
  });
}

// process the job = place the url as a value in redis
const processJob = (job, data, res) => {
  client.hset(job.id, 'data', job.data, redis.print);
}

// run jobs concurrently
queue.process('job', 10, (job, res, req, done) => {
  processJob(job, done);
  // createJob(job, res, req);
})

// checks the status by grabbing the id and checking it's state
const statusCheck = (id, res) => {
  kue.Job.get(id, (err, job) => {
    if(!err){
      res.send('The status of job ID #' + job.id + ' is ' + job._state);
    } else {
      res.send('Something went wrong ' + err);
    }
  })
}

// checks to see any inactive count
queue.inactiveCount( (err, total) => {
  console.log('inactive:', total);
});

queue.watchStuckJobs()

module.exports = {
  create: (data, req, res) => {
    createJob(data, req, res);
  },
  requestStatus: (id, res) => {
    statusCheck(id, res)
  },
  validInput: (data) => {
    validUrl(data);
  }
};
