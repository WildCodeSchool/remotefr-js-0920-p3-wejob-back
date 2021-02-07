/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable object-shorthand */
const express = require('express');
const randtoken = require('rand-token');
const path = require('path');
const fs = require('fs');
const util = require('util');
const multer = require('multer');
const slug = require('slug');
const sendToken = require('../services/send-token');
const sendTokenForgotPwd = require('../services/send-token-forgot-pwd');
const hashPassword = require('./hash-password');
const pool = require('../pool');
const {
  checkIsAdmin,
  softCheckIsAdmin,
  checkCanUpdateCandidat,
} = require('../middlewares/auth');
const getCandidateFields = require('../middlewares/get-candidate-fields');
const getUploadFilename = require('../helpers/get-upload-filename');

const router = express.Router();
const removeFile = util.promisify(fs.unlink);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const filename = getUploadFilename(file, req.candidate);
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
});

/**
 * si cookie.isAdmin true retourner toute la liste si false 401
 * sinon pas de cookie toute la liste isCheck true
 */
router.get('/', softCheckIsAdmin, async (req, res) => {
  const isAdmin = req.user && req.user.isAdmin;
  const where = isAdmin ? '1 = 1' : 'user_fiche.isCheck = 1';
  const fields = isAdmin
    ? 'lastname,user.email'
    : 'SUBSTR(lastname, 1, 1) AS lastname';

  try {
    const [fiches] = await pool.query(`
    SELECT
      user.id,slug,${fields},
      user_fiche.id AS user_fiche_id,
      civility, firstname, job, keywords, description,
      picture, availability, mobility, isCheck
    FROM user
    LEFT JOIN user_fiche
    ON user.id = user_fiche.user_id
    WHERE ${where}`);
    const [language] = await pool.query(
      `SELECT l.id AS id_lang, l.language AS lang, ul.user_id AS user_id FROM language l JOIN user_language ul ON ul.language_id=l.id`,
    );
    const [sectors] = await pool.query(
      `SELECT
        s.id AS id_sector,
        s.name AS name_sector,
        us.user_id AS user_id
      FROM
        sector_of_activity s
      JOIN
        user_sector_of_activity us
      ON
        us.sector_of_activity_id = s.id`,
    );

    const fichesCandidats = fiches.map((f) => {
      const langToUSer = language.filter((l) => l.user_id === f.id);
      const sectorToUSer = sectors.filter((s) => s.user_id === f.id);
      return {
        ...f,
        language: langToUSer,
        sector_of_activity: sectorToUSer,
      };
    });
    return res.status(200).json(fichesCandidats);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * uniquement si cookie present et isAdmin true sinon 401
 */
router.post('/', checkIsAdmin, async (req, res) => {
  try {
    const token = randtoken.generate(32);
    const userAdd = await pool.query(
      'INSERT INTO user (email, token) VALUES (?, ?)',
      [req.body.email, token],
    );

    await sendToken(req.body.email, token);
    return res.status(201).json({ id: userAdd[0].insertId });
  } catch (error) {
    const status = error.code === 'ER_DUP_ENTRY' ? 409 : 500;
    return res.status(status).json({
      error: error.message,
    });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const checkIfExists = await pool.query(
      'SELECT COUNT(email) FROM user WHERE email=?',
      [req.body.email],
    );
    if (checkIfExists === 0) {
      return res.status(500).json({
        error:
          'Cet e-mail n’existe pas chez We-Job. Merci de contacter votre conseiller.',
      });
    }
    const token = await randtoken.generate(32);
    await pool.query('UPDATE user SET token=? WHERE email=?', [
      token,
      req.body.email,
    ]);
    await sendTokenForgotPwd(req.body.email, token);
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

router.post(
  '/:id/files',
  checkCanUpdateCandidat,
  getCandidateFields,
  upload.fields([{ name: 'cv1' }, { name: 'cv2' }, { name: 'picture' }]),
  async (req, res) => {
    const data = {};
    // 204 or error code?
    if (req.files.length === 0) return res.sendStatus(204);

    try {
      Object.keys(req.files).forEach((key) => {
        data[key] = req.files[key][0].filename;
      });
      if (Object.keys(data).length === 0) return res.sendStatus(204);
      await pool.query('UPDATE user_fiche SET ? WHERE user_id = ?', [
        data,
        req.params.id,
      ]);
      return res.sendStatus(204);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: `Error while processing files: ${err.message}`,
      });
    }
  },
);

router.post('/update-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const [
      status,
    ] = await pool.query(
      'UPDATE user SET password=?, token=NULL WHERE token=?',
      [hashedPassword, token],
    );
    if (status.affectedRows === 0) {
      return res.status(401).json({
        error: 'Ce lien a expiré.',
      });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * uniquemetn si cookie present et isAdmin true sinon 401
 */
router.delete('/:id', checkIsAdmin, async (req, res) => {
  try {
    const [
      userInfo,
      userFields,
    ] = await pool.query(
      'SELECT user_id, cv1, cv2, picture FROM user_fiche WHERE user_id =?',
      [req.params.id],
    );
    const { cv1, cv2, picture, user_id } = userInfo[0];
    if (cv1) {
      await removeFile(path.join(process.cwd(), cv1.split('uploads/')[1]));
    }
    if (cv2) {
      await removeFile(path.join(process.cwd(), cv2.split('uploads/')[1]));
    }
    if (picture) {
      await removeFile(path.join(process.cwd(), picture.split('uploads/')[1]));
    }
    // await pool.query('DELETE FROM user WHERE id=?', [user_id]);
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * uniquement si cookie[wejobjwt] present
 * sinon cookie recruiter present sinon 401
 */
router.get('/:idOrSlug', softCheckIsAdmin, async (req, res) => {
  try {
    const isAdmin = req.user && req.user.isAdmin;
    const candidatIdOrSlug = req.params.idOrSlug;
    const candidatIdNum = Number(candidatIdOrSlug);
    // allow only access by slug for non-admin (recruiters/public app)
    if (!isAdmin && !Number.isNaN(candidatIdNum)) {
      return res.sendStatus(403);
    }
    const [[fiche]] = await pool.query(
      `
    SELECT user.id, user_fiche.id AS user_fiche_id, email, civility, lastname, firstname, description, diploma, cv1, cv2, job, keywords, linkedin, youtube, picture, availability, mobility, years_of_experiment, isCheck, create_at, update_at, isOpen_to_formation
    FROM user LEFT JOIN user_fiche ON user.id = user_fiche.user_id WHERE user.id = ?`,
      candidatIdOrSlug,
    );
    if (!fiche) {
      return res.sendStatus(404);
    }
    const candidatId = fiche.id;
    const [language] = await pool.query(
      `SELECT l.id AS id_lang, l.language AS lang, ul.user_id AS user_id FROM language l JOIN user_language ul ON ul.language_id=l.id WHERE ul.user_id = ?`,
      candidatId,
    );
    const [sectors] = await pool.query(
      `SELECT s.id AS id_sector, s.name AS name_sector, us.user_id AS user_id FROM sector_of_activity s JOIN user_sector_of_activity us ON us.sector_of_activity_id = s.id WHERE us.user_id = ?`,
      candidatId,
    );
    // const profileCandidat = Object.assign({}, fiche, language, sectors);
    const profileCandidat = {
      ...fiche,
      language: language,
      sector_of_activity: sectors,
    };
    return res.status(200).json(profileCandidat);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});
/**
 * uniquemetn si cookie present et isAdmin true pour le champs isCheck
 * si isAdmin false tout sauf isCheck
 * sinon 401
 */
router.put('/:id', checkCanUpdateCandidat, async (req, res) => {
  try {
    const candidatToUpdateId = req.params.id;
    // On vérifie si le fiche existe
    const [
      [fiche],
    ] = await pool.query(`SELECT id FROM user_fiche WHERE user_id=?`, [
      candidatToUpdateId,
    ]);
    let ficheId;
    // Sinon on la crée
    if (!fiche) {
      const [
        status,
      ] = await pool.query(`INSERT INTO user_fiche (user_id) VALUES (?)`, [
        candidatToUpdateId,
      ]);
      ficheId = status.insertId;
    } else {
      ficheId = fiche.id;
    }
    const {
      email,
      civility,
      lastname,
      firstname,
      description,
      diploma,
      job,
      keywords,
      linkedin,
      youtube,
      availability,
      mobility,
      years_of_experiment,
      update_at,
      isOpen_to_formation,
    } = req.body;

    if (!['Monsieur', 'Madame'].includes(civility)) return res.sendStatus(400);

    // eslint-disable-next-line no-restricted-properties
    const id36 = (candidatToUpdateId + Math.pow(36, 3)).toString(36);
    const slugBase =
      firstname && lastname ? slug(`${firstname} ${lastname}`) : 'candidat';
    const idSlug = `${id36}-${slugBase}`;

    const isAdmin = req.user && req.user.isAdmin;
    let { isCheck } = req.body;
    if (!isAdmin) isCheck = 0;

    if (email)
      await pool.query(
        `
    UPDATE user
    SET email = ?
    WHERE id = ?`,
        [email, candidatToUpdateId],
      );

    await pool.query(
      `
    UPDATE
      user_fiche
    SET
      slug=?, civility=?, lastname=?, firstname=?, description=?, diploma=?,
      job=?, keywords = ?, linkedin=?, youtube=?,
      availability=?, mobility=?, years_of_experiment=?, isCheck=?, update_at=?, isOpen_to_formation=?
    WHERE id = ?`,
      [
        idSlug,
        civility,
        lastname,
        firstname,
        description,
        diploma,
        job,
        keywords,
        linkedin,
        youtube,
        availability,
        mobility,
        years_of_experiment,
        isCheck,
        update_at,
        isOpen_to_formation,
        ficheId,
      ],
    );

    const insertedLanguage = req.body.language;
    await pool.query(`DELETE FROM user_language WHERE user_id=?`, [
      candidatToUpdateId,
    ]);
    if (insertedLanguage && insertedLanguage.length > 0) {
      const insertedLangValues = insertedLanguage.map((langue) => [
        candidatToUpdateId,
        langue.id,
      ]);
      await pool.query(
        `INSERT INTO user_language(user_id, language_id) VALUES ?`,
        [insertedLangValues],
      );
    }
    const insertedSectors = req.body.sector_of_activity;
    if (insertedSectors && insertedSectors.length > 0) {
      await pool.query(`DELETE FROM user_sector_of_activity WHERE user_id=?`, [
        candidatToUpdateId,
      ]);
      const insertedSectorValues = insertedSectors.map((sector) => [
        candidatToUpdateId,
        sector.id,
      ]);
      await pool.query(
        `INSERT INTO user_sector_of_activity(user_id, sector_of_activity_id) VALUES ?`,
        [insertedSectorValues],
      );
    }

    return res.status(204).json(candidatToUpdateId);
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
