'use strict';

const axios = require('axios');
const app = require('../app');

const createJob = (data, res) => {
  let job = queue.create('job', data)
    .priority('high')
    // .attempts(8)
    .removeOnComplete(true)
    .save((err) => {
      if(err){
        console.log(err);
        res.send('There was an error with data transfer')
      } else {
        res.send('Your job ID is ' + job.id);
        client.hset(job.id, 'data', 'none', redis.print);
        processJob();
      }
    });
}

const processJob = (job, done) => {
  axios.get(job.data);
    .then((res) => {
      client.hset(job.id, 'data', res.data, redis.print);
      done();
    });
}

queue.process('request', 20, (job, done) => {
  processJob(job, done);
});

module.exports = {
  createJob(data, res);
}

