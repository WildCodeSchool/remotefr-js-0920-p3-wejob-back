const request = require('supertest');
const app = require('../../app');
const { reset: resetDatabase } = require('../db');
const { createUser } = require('../utils');

function testLogin(requestBody, expectedStatus) {
  return request(app)
    .post('/api/auth/login')
    .send(requestBody)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(expectedStatus);
}

describe('POST /api/auth/login', () => {
  beforeEach(resetDatabase);

  it('send empty payload', () => testLogin({}, 422));

  it('send correct fields', async () => {
    await createUser('foo3@bar.com');
    return testLogin({ email: 'foo3@bar.com', password: 'Zyx765**' }, 200);
  });
});
