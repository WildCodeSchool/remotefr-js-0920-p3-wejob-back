const request = require('supertest');
const app = require('../../app');
const { reset: resetDatabase, close } = require('../db');
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
  after(() => {
    try {
      close();
    } catch (err) {
      console.error(err.stack);
    }
    // console.log('tous les tests ont été exécutés');
  });

  it('send empty payload', () => testLogin({}, 422));

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
  it('send correct fields', async () => {
    await createUser('foo3@bar.com');
    return testLogin({ email: 'foo3@bar.com', password: 'Zyx765**' }, 200);
  });
});
