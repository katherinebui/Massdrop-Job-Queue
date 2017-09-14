// 'use strict';

// const axios = require('axios');
// const app = require('../app');

// const kue = require('kue');
// const queue = kue.createQueue();

// const redis = require('redis');
// const client = redis.createClient();

// client.on('connect', () =>{
//   console.log('Redis connection established!');
// })

// client.on('error', (err) => {
//   console.log('An error has occurred: ' + err);
// })

// queue.on('ready', () => {
//   console.log('Queue is ready!')
// });

// queue.on('error', (err) => {
//   console.log('There was an log in the main queue!');
//   console.log(err);
// })

// const createJob = (data, res) => {
//   let job = queue.create('request', data)
//     .priority('high')
//     .removeOnComplete(true)
//     .save((err) => {
//       if(err){
//         console.log(err);
//         res.send('There was an error with data transfer');
//       } else {
//         res.send('Your job ID is ' + job.id);
//         client.hset("job.id", `${url}`, 'none', redis.print);
//         processJob();
//       }
//     });
// }

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

// module.exports = createJob;

