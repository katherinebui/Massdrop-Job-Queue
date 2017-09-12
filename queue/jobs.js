'use strict';

let redisConfig;
if (process.env.NODE_ENV === 'production'){
  redisConfig = {
    redis: {
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
      auth: process_env.REDIS_PASS,
      options: {
        no_ready_check: false
      }
    }
  };
  else {
    redisConfig = {};
  }
}

const kue = require('kue');
const queue = kue.createQueue(redisConfig);
queue.watchStuckJobs(1000 * 10)

queue.on('ready', () => {
  console.info('Queue is ready!')
});

queue.on('error', (err) => {
  console.error('There was an error in the main queue!');
  console.error(err);
  console.err(err.stack);
})

kue.app.listen(process.env.KUE_PORT);
kue.app.set('title', 'Kue');

function createJob(data, done){
  queue.create('job', data){
    .priority('high')
    .attempts(8)
    .backoff(true)
    .removeOnCompelte(true)
    .save(err => {
      if(err){
        console.error(err);
        done(err);
      }
      if(!err){
        done();
      }
    });
  }
}

module.exports = {
  create: (data, done) => {
    createJob(data, done);
  }
}






