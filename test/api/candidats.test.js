const request = require('supertest');
const { expect } = require('chai');
const { join, resolve } = require('path');
const app = require('../../app');
const { reset: resetDatabase } = require('../db');
const { createUser, createAndLogin, getUserFiche } = require('../utils');
const getUploadFilename = require('../../helpers/get-upload-filename');

const assetsDir = resolve(__dirname, '..', '..', 'test-assets');
const files = {
  picture: join(assetsDir, 'cat.png'),
  cv1: join(assetsDir, 'cv.pdf'),
  cv2: join(assetsDir, 'cv.pdf'),
};

function testUpdate(...args) {
  expect(args.length).to.equal(4, 'testUpdate expects 4 arguments');
  const [userId, jwt, requestBody, expectedStatus] = args;
  const req = request(app)
    .put(`/api/candidats/${userId}`)
    .send(requestBody)
    .set('Accept', 'application/json');
  if (jwt) req.set('Cookie', [`token=${jwt}`]);
  return req.expect(expectedStatus);
}
function testUpdateFiles(...args) {
  expect(args.length).to.equal(4, 'testUpdateFiles expects 4 arguments');
  const [userId, jwt, fileFields, expectedStatus] = args;
  // Create request
  const req = request(app).post(`/api/candidats/${userId}/files`);
  // Attach files OR just a dummy field (request hangs if it has no content)
  if (fileFields.length > 0) fileFields.forEach((f) => req.attach(f, files[f]));
  else req.field('_dummy', '');
  // Send request
  return req
    .set('Accept', 'application/json')
    .set('Cookie', [`token=${jwt}`])
    .expect(expectedStatus);
}

describe('Candidate routes', () => {
  before(resetDatabase);
  describe('PUT /api/candidats/:id', () => {
    it('without auth', async () => {
      const { id } = await createUser();
      return testUpdate(id, null, {}, 401);
    });

    it('with wrong auth (other user)', async () => {
      const { token: token1 } = await createAndLogin();
      const { id: id2 } = await createAndLogin();
      return testUpdate(id2, token1, {}, 403);
    });

    it('with empty payload (civility missing)', async () => {
      const { id, token } = await createAndLogin();
      return testUpdate(id, token, {}, 400);
    });

    it('with only civility', async () => {
      const { id, token } = await createAndLogin();
      const payload = { civility: 'Monsieur' };
      return testUpdate(id, token, payload, 204);
    });

    it('with isCheck, as a candidate', async () => {
      const { id, token } = await createAndLogin();
      const payload = { civility: 'Monsieur', isCheck: 1 };
      await testUpdate(id, token, payload, 204);
      const fiche = await getUserFiche(id);
      expect(fiche.isCheck).to.equal(0);
    });
  });

  describe('POST /api/candidats/:id/files', async () => {
    const payload = {
      civility: 'Monsieur',
      firstname: 'foo',
      lastname: 'baz',
    };
    const uploadImg = { fieldname: 'picture', originalname: 'cat.png' };
    const uploadCv1 = { fieldname: 'cv1', originalname: 'cv.pdf' };
    const uploadCv2 = { fieldname: 'cv2', originalname: 'cv.pdf' };
    let id;
    let token;

    before(async () => {
      const user = await createAndLogin();
      id = user.id;
      token = user.token;
      return Promise.resolve();
    });

    it('send a file', async () => {
      await testUpdate(id, token, payload, 204);
      await testUpdateFiles(id, token, ['picture'], 204);
      const fiche = await getUserFiche(id);
      const uploadFilename = getUploadFilename(uploadImg, fiche);
      expect(fiche.picture).to.equal(uploadFilename);
    });

    // Check that files don't "disappear" if we upload 3 files
    // then send another request with 0
    it('send three files then nothing', async () => {
      await testUpdate(id, token, payload, 204);
      await testUpdateFiles(id, token, ['cv1', 'cv2', 'picture'], 204);
      await testUpdateFiles(id, token, [], 204);
      const fiche = await getUserFiche(id);
      const uploadImgFname = getUploadFilename(uploadImg, fiche);
      const uploadCv1Fname = getUploadFilename(uploadCv1, fiche);
      const uploadCv2Fname = getUploadFilename(uploadCv2, fiche);
      expect(fiche.picture).to.equal(uploadImgFname);
      expect(fiche.cv1).to.equal(uploadCv1Fname);
      expect(fiche.cv2).to.equal(uploadCv2Fname);
    });
  });
});
