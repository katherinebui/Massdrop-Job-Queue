'use strict';

// const axios = require('axios');
const app = require('../app');

const kue = require('kue');
const queue = kue.createQueue();

const redis = require('redis');
const client = redis.createClient();

client.on('connect', () =>{
  console.log('Redis connection established!');
})

client.on('error', (err) => {
  console.log('An error has occurred: ' + err);
})

module.exports = {

  createJob: function(data, res){
    let job = queue.create('request', data)
      .priority('high')
      .removeOnComplete(true)
      .save((err) => {
        if(err){
          console.log(err);
          res.send('There was an error with data transfer');
        } else {
          res.send('Your job ID is ' + job.id);
          client.hset(job.id, data, 'none', redis.print);
        }
      });
  }

}
// var job = queue.create('email', {
//     title: 'welcome email for tj'
// }).save( function(err){
//    if( !err ) console.log( 'this is not job err ' + job.id );
// });

// job.on('complete', function(result){
//   console.log('Job completed with data ', result);

// }).on('failed attempt', function(errorMessage, doneAttempts){
//   console.log('Job failed');

// }).on('failed', function(errorMessage){
//   console.log('Job failed');

// }).on('progress', function(progress, data){
//   console.log('\r  job #' + job.id + ' ' + progress + '% complete with data ', data );

// });

// const processJob = (job, done) => {
//   axios.get(job.data)
//     .then((res) => {
//       client.hset(job.id, 'data', res.data, redis.print);
//       done();
//     });
// }

// queue.process('request', 20, (job, done) => {
//   processJob(job, done);
// });

