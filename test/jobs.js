"use strict";

const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const queue = require('kue').createQueue();

const test = require('tape');

const dummyRequest = 'www.google.com'


test('Receiving and processing jobs', t => {
  api
    .post('/create/:url')
    .send(dummyRequest)
    .end((err, res) => {
      const job = res.body.job

      // Check for response body
      t.ok(res.body, 'Should respond with a body');

      // Check for response meta properties
      // t.equals(res.body.success, true, 'The success property should be true');
      // t.equals(res.body.error, null, 'The error property should be null');
      // t.ok(res.body.message, 'Should have a message property');

      // Check to see if the order is intact
    //   t.equals(order.received, true, 'Should have been received');
    //   t.equals(order.orderID, dummyOrder.orderID, 'Order ID should be the same');
    //   t.equals(order.paymentToken, dummyOrder.paymentToken, 'Payment token should be the same');
    //   t.equals(order.productID, dummyOrder.productID, 'Product ID should be the same');
    //   t.end();
    // });
});
// test('Creating payments and processing items with the queue', t => {
//   queue.testMode.enter();

//   queue.createJob('payment', dummyOrder).save();
//   queue.createJob('payment', dummyOrder).save();

//   t.equal(queue.testMode.jobs.length, 2, 'There should be two jobs');
//   t.equal(queue.testMode.jobs[0].type, 'payment', 'The jobs should be of type payment');
//   t.equal(queue.testMode.jobs[0].data, dummyOrder, 'The job data should be intact');

//   queue.testMode.clear();
//   queue.testMode.exit()
//   t.end();
});
