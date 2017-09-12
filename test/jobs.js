"use strict";

const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const queue = require('kue').createQueue();

const test = require('tape');

const fakeJob = {
  // This job property lets you make better use of the UI
  title: 'www.google.com',
  jobID: '101',
  received: true,
  receivedAt: new Date('September 12, 2017 12:59:59'),
  createdAt: new Date('September 12, 2017 12:58:59'),
  customer: {
    firstName: 'A',
    lastName: 'Person',
    email: 'example@example.com',
    address: '1234 somewhere lane, ? USA 12345'
  }
};


test('Receiving and processing jobs', t => {
  api
    .post('/jobs')
    .send(fakeJob)
    .end((err, res) => {
      const jobInfo = res.body.jobInfo

      // Check for response body
      t.ok(res.body, 'Should respond with a body');

      // Check for response meta properties
      t.equals(res.body.success, true, 'The success property should be true');
      t.equals(res.body.error, null, 'The error property should be null');
      t.ok(res.body.message, 'Should have a message property');

      // Check to see if the jobInfo is intact
      t.equals(jobInfo.received, true, 'Should have been received');
      t.equals(jobInfo.jobInfoID, fakeJob.jobInfoID, 'jobInfo ID should be the same');
      t.end();
    });
});

test('Creating jobs and processing items with the queue', t => {
  queue.testMode.enter();

  queue.createJob('job', fakeJob).save();
  queue.createJob('job', fakeJob).save();

  t.equal(queue.testMode.jobs.length, 2, 'There should be two jobs');
  t.equal(queue.testMode.jobs[0].type, 'job', 'The jobs should be of type job');
  t.equal(queue.testMode.jobs[0].data, fakeJob, 'The job data should be intact');

  queue.testMode.clear();
  queue.testMode.exit()
  t.end();
});
