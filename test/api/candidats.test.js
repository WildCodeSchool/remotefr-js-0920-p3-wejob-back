const request = require('supertest');
const { expect } = require('chai');
const app = require('../../app');
const { reset: resetDatabase } = require('../db');
const { createUser, createAndLogin } = require('../utils');

function testUpdate(...args) {
  expect(args.length).to.equal(4, 'testUpdate expects 4 arguments');
  const [userId, jwt, requestBody, expectedStatus] = args;
  const req = request(app)
    .put(`/api/candidats/${userId}`)
    .send(requestBody)
    .set('Accept', 'application/json');
  if (jwt) req.set('Cookie', [`token=${jwt}`]);
  // .expect('Content-Type', /json/)
  return req.expect(expectedStatus);
}

describe('PUT /api/auth/candidat/:id', () => {
  beforeEach(resetDatabase);

  it('without auth', async () => {
    const { id } = await createUser('update1@wj.com');
    return testUpdate(id, null, {}, 401).catch((err) =>
      console.error('in test', err),
    );
  });

  it('with wrong auth (other user)', async () => {
    const { token: token1 } = await createAndLogin('update2a@wj.com');
    const { id: id2 } = await createAndLogin('update2b@wj.com');
    return testUpdate(id2, token1, {}, 403);
  });

  it('with empty payload (civility missing)', async () => {
    const { id, token } = await createAndLogin('update3@wj.com');
    return testUpdate(id, token, {}, 400);
  });

  it('with only civility', async () => {
    const { id, token } = await createAndLogin('update3@wj.com');
    const payload = { civility: 'Monsieur' };
    return testUpdate(id, token, payload, 204);
  });

  // it('empty payload', async () => {
  //   const user = await createUser('update1@wj.com');
  //   return testUpdate(user.id, null, {}, 422);
  // });

  // it('send email&password but empty', (done) => {
  //   testLogin({ email: '', password: '' }, 422, done);
  // });

  // it('send invalid email', (done) => {
  //   testLogin({ email: 'foobar@foobar', password: 'SomePass' }, 422, done);
  // });

  // // tester enregistrement d'email en doublon, censé renvoyer 409
  // it('send sending same email twice', (done) => {
  //   testLogin(
  //     { email: 'foobar@example.com', password: 'SomePass' },
  //     201,
  //     () => {
  //       testLogin(
  //         { email: 'foobar@example.com', password: 'SomePass' },
  //         409,
  //         done,
  //       );
  //     },
  //   );
  // });

  // tester le cas où on envoie les bons champs
  // it('send correct fields', async () => {
  //   await createUser('foo3@bar.com');
  //   return testLogin({ email: 'foo3@bar.com', password: 'Zyx765**' }, 200);
  // });
});
