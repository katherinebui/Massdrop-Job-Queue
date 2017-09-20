'use strict';

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

// creates job in queue, if successful- will great a new key value pair in redis placing url into the db
const createJob = (data, res) => {
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
// places the value again just in case it wasn't placed the first time
const processJob = (job, data) => {
  client.hset(job.id, 'data', job.data, redis.print);
}

// run jobs concurrently
queue.process('job', 10, (job, done) => {
  processJob(job, done);
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

queue.watchStuckJobs(6000)

module.exports = {
  create: (data, res) => {
    createJob(data, res);
  },
  requestStatus: (id, res) => {
    statusCheck(id, res)
  }
};
