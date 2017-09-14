'use strict';

const app = require('../app');

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

const createJob = (data, res) => {
  let job = queue.create('job', data)
  .priority('high')
  .removeOnComplete(true)
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
    if(err){
      console.log(err);
      res.send('There was a problem creating the job');
    } else {
      res.send('Your job ID is ' + job.id);
      client.hset(job.id, 'data', 'none', redis.print);
    }
  });
}

const processJob = (job, data, res) => {
  // console.log(job.id);
  // console.log(job.data);
  client.hset(job.id, 'data', job.data, redis.print);
}

queue.process('job', 20, (job, done) => {
  processJob(job, done);
})

const statusCheck = (id, res) => {
  kue.Job.get(id, (err, job) => {
    res.send('The status of job id #' + job.id + ' is ' + job._state);
  })
}

module.exports = {
  create: (data, done) => {
    createJob(data, done);
  },
  requestStatus: (id, res) => {
    statusCheck(id, res)
  }
};
