/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable object-shorthand */
const express = require('express');
const randtoken = require('rand-token');
const slug = require('slug');
const path = require('path');
const multer = require('multer');
const sendToken = require('../services/send-token');
const hashPassword = require('./hash-password');

const router = express.Router();

const pool = require('../pool');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.');
    let ch = slug(
      `${req.body.lastname} ${req.body.firstname} ${file.fieldname}`,
      '_',
    );
    ch += `.${ext[ext.length - 1]}`;
    cb(null, ch);
  },
});

const upload = multer({
  storage: storage,
});

/**
 * si cookie.isAdmin true retourner toute la liste si false 401
 * sinon pas de cookie toute la liste isCheck true
 */
router.get('/', async (req, res) => {
  try {
    const [fiches] = await pool.query(`
    SELECT id, civility, lastname, firstname, job, description, picture, availability, mobility, isCheck
    FROM user_fiche`);
    const [language] = await pool.query(
      `SELECT l.id AS id_lang, l.language AS lang, ul.user_id AS user_id FROM language l JOIN user_language ul ON ul.language_id=l.id`,
    );
    const [sectors] = await pool.query(
      `SELECT s.id AS id_sector, s.name AS name_sector, us.user_id AS user_id FROM sector_of_activity s JOIN user_sector_of_activity us ON us.sector_of_activity_id = s.id`,
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
 * uniquemetn si cookie present et isAdmin true sinon 401
 */
router.post('/', async (req, res) => {
  try {
    const token = randtoken.generate(32);
    const userAdd = await pool.query(
      'INSERT INTO user (email, token) VALUES (?, ?)',
      [req.body.email, token],
    );
    // const newUser = await pool.query(
    //   `SELECT id, email FROM user WHERE email=?`,
    //   [req.body.email],
    // );
    await sendToken(req.body.email, token);
    return res.status(201).json({ id: userAdd[0].insertId });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

router.post(
  '/file',
  upload.fields([{ name: 'cv1' }, { name: 'cv2' }, { name: 'picture' }]),
  (req, res) => {
    const data = req.body;
    if (req.files.length !== 0) {
      Object.keys(req.files).forEach((key) => {
        data[key] = req.files[key][0].path;
      });
    }
    res.sendStatus(200);
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
router.delete('/:id', (req, res) => {
  try {
    pool.query('DELETE FROM user_fiche WHERE id=?', req.params.id);
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * uniquement si cookie[wejobjwt] present
 * sinon cookie recognizeRecruiter present sinon 401
 */
router.get('/:id', async (req, res) => {
  try {
    const candidatId = req.params.id;
    const [fiche] = await pool.query(
      `
    SELECT id, civility, lastname, firstname, description, diploma, cv1, cv2, job, linkedin, youtube, picture, availability, mobility, years_of_experiment, isCheck, create_at, update_at, isOpen_to_formation
    FROM user_fiche WHERE id = ?`,
      candidatId,
    );
    if (!fiche) {
      return res.sendStatus(404);
    }
    const language = await pool.query(
      `SELECT l.id AS id_lang, l.language AS lang, ul.user_id AS user_id FROM language l JOIN user_language ul ON ul.language_id=l.id WHERE ul.user_id = ?`,
      candidatId,
    );
    const sectors = await pool.query(
      `SELECT s.id AS id_sector, s.name AS name_sector, us.user_id AS user_id FROM sector_of_activity s JOIN user_sector_of_activity us ON us.sector_of_activity_id = s.id WHERE us.user_id = ?`,
      candidatId,
    );
    const profileCandidat = {
      fiche: fiche,
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
router.put('/:id', async (req, res) => {
  try {
    const candidatToUpdateId = req.params.id;
    const {
      email,
      civility,
      lastname,
      firstname,
      description,
      diploma,
      cv1,
      cv2,
      job,
      linkedin,
      youtube,
      picture,
      availability,
      mobility,
      years_of_experiment,
      isCheck,
      update_at,
      isOpen_to_formation,
      name_sector,
      name_job,
    } = req.body;

    await pool.query(
      `
    UPDATE user
    INNER JOIN user_fiche
    ON user.id=user_fiche.id
    SET user.email = ?
    WHERE user_fiche.id = ?`,
      [email, candidatToUpdateId],
    );

    await pool.query(
      `
    UPDATE user_fiche
    SET civility=?, lastname=?, firstname=?, description=?, diploma=?, cv1=?, cv2=?, job=?, linkedin=?, youtube=?, picture=?, 
    availability=?, mobility=?, years_of_experiment=?, isCheck=?, update_at=?, isOpen_to_formation=?
    WHERE id = ?`,
      [
        civility,
        lastname,
        firstname,
        description,
        diploma,
        cv1,
        cv2,
        job,
        linkedin,
        youtube,
        picture,
        availability,
        mobility,
        years_of_experiment,
        isCheck,
        update_at,
        isOpen_to_formation,
        candidatToUpdateId,
      ],
    );

    const insertedLanguage = req.body.language;
    await pool.query(`DELETE FROM user_language WHERE user_id=?`, [
      candidatToUpdateId,
    ]);
    const insertedLangValues = insertedLanguage.map((langue) => [
      candidatToUpdateId,
      langue.id,
    ]);
    await pool.query(
      `INSERT INTO user_language(user_id, language_id) VALUES ?`,
      [insertedLangValues],
    );

    const insertedSectors = req.body.sector_of_activity;
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

    return res.status(204).json(candidatToUpdateId);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
