"use strict";

const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const queue = require('kue').createQueue();

const test = require('tape');

const dummyRequest = 'www.google.com';

test('Receiving and processing jobs', t => {
  api
    .post('/create/:url')
    .send(dummyRequest)
    .end((err, res) => {
      t.ok(res.body, 'Should respond with a body');
      t.equals(res.body.success, true, 'The success property should be true');
      t.ok(res.body.message, 'Should have a message property');
      t.end();
  });
});

const dummyID = '1';

test('Gets status by ID of job', t => {
  api
    .get('/:id/status')
    .send(dummyID)
    .end((err, res) => {
      t.ok(res.body.message, 'Should have a message property');
      t.end();
  });
});

test('Creating jobs and processing items with the queue', t => {
  queue.testMode.enter();

  queue.createJob('job', dummyRequest).save();
  queue.createJob('job', dummyRequest).save();

  t.equal(queue.testMode.jobs.length, 2, 'There should be two jobs');
  t.equal(queue.testMode.jobs[0].type, 'job', 'The jobs should be of type job');
  t.equal(queue.testMode.jobs[0].data, dummyRequest, 'The job data should be intact');

  queue.testMode.clear();
  queue.testMode.exit()
  t.end();
});
