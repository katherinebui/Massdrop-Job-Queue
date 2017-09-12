'use strict';

const redis = require('redis');
const kue = require('kue');
const validURL = require('valid-url');
const app = require('../app');

const redisClient = redis.createClient();
const queue = kue.createQueue();

redisClient.on('connect', function() {
  console.log('Redis connection established!');
})

redisClient.on('error', function(err){
  console.log('An error has occurred: ' + err);
})

queue.on('ready', () => {
  console.log('Queue is ready!')
});

queue.on('error', (err) => {
  console.log('There was an log in the main queue!');
  console.log(err);
  console.log(err.stack);
})

function createJob(data, done){
  queue.create('job', data)
    .priority('high')
    .attempts(8)
    .backoff(true)
    .removeOnCompelte(true)
    .save(err => {
      if(err){
        console.log(err);
        done(err);
      }
      if(!err){
        done();
      }
    });
}

module.exports = {
  create: (data, done) => {
    createJob(data, done);
  }
}






