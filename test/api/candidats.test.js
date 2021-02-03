const request = require('supertest');
const { expect } = require('chai');
const { join, resolve } = require('path');
const app = require('../../app');
const { reset: resetDatabase } = require('../db');
const { createUser, createAndLogin, getUserFiche } = require('../utils');
const getUploadFilename = require('../../helpers/get-upload-filename');

const assetsDir = resolve(__dirname, '..', 'assets');
const files = {
  picture: join(assetsDir, 'cat.png'),
};

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
function testUpdateFiles(...args) {
  expect(args.length).to.equal(4, 'testUpdateFiles expects 4 arguments');
  const [userId, jwt, expectedStatus] = args;
  return request(app)
    .post(`/api/candidats/${userId}/files`)
    .attach('picture', files.picture)
    .set('Accept', 'application/json')
    .set('Cookie', [`token=${jwt}`])
    .expect(expectedStatus);
}

describe('Candidate routes', () => {
  beforeEach(resetDatabase);
  describe('PUT /api/auth/candidat/:id', () => {
    it('without auth', async () => {
      const { id } = await createUser('update1@wj.com');
      return testUpdate(id, null, {}, 401);
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
      const { id, token } = await createAndLogin('update4@wj.com');
      const payload = { civility: 'Monsieur' };
      return testUpdate(id, token, payload, 204);
    });

    it('with isCheck, as a candidate', async () => {
      const { id, token } = await createAndLogin('update5@wj.com');
      const payload = { civility: 'Monsieur', isCheck: 1 };
      await testUpdate(id, token, payload, 204);
      const fiche = await getUserFiche(id);
      expect(fiche.isCheck).to.equal(0);
    });
  });

  describe('PUT /api/auth/candidat/:id/files', () => {
    it('send a file', async () => {
      const { id, token } = await createAndLogin('update6@wj.com');
      const payload = {
        civility: 'Monsieur',
        firstname: 'foo',
        lastname: 'baz',
      };
      const upload = { fieldname: 'picture', originalname: 'cat.png' };
      await testUpdate(id, token, payload, 204);
      await testUpdateFiles(id, token, {}, 204);
      const fiche = await getUserFiche(id);
      const uploadFilename = getUploadFilename(upload, fiche);
      expect(fiche.picture).to.equal(uploadFilename);
    });
  });
});
