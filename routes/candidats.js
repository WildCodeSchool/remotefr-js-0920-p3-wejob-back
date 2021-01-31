const express = require('express');
const randtoken = require('rand-token');
const sendToken = require('../services/send-token');
const hashPassword = require('./hash-password');
const cors = require('cors');

const router = express.Router();

const pool = require('../pool');

router.use(cors({
  origin: process.env.FRONT_URL,
  credentials: true,
  optionsSuccessStatus: 200,
})
);

router.get('/', async (req, res) => {
  try {
    const [fiches] = await pool.query(`
    SELECT id, civility, lastname, firstname, job, description, picture, availability, mobility, isCheck
    FROM user_fiche`);
    const [language] = await pool.query(`SELECT l.id AS id_lang, l.language AS lang, ul.user_id AS user_id FROM language l JOIN user_language ul ON ul.language_id=l.id`);
    const [sectors] = await pool.query(`SELECT s.id AS id_sector, s.name AS name_sector, us.user_id AS user_id FROM sector_of_activity s JOIN user_sector_of_activity us ON us.sector_of_activity_id = s.id`);

    const fichesCandidats = fiches.map(f => {
      const langToUSer = language.filter(l => l.user_id === f.id);
      const sectorToUSer = sectors.filter(s => s.user_id === f.id);
      return {
        ...f,
        language: langToUSer,
        sector_of_activity: sectorToUSer,
      }
    })
    return res.status(200).json(fichesCandidats);

  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const token = randtoken.generate(32);
    await pool.query('INSERT INTO user (email, token) VALUES (?, ?)', [req.body.email, token]);
    const newUser = await pool.query(`SELECT id, email FROM user WHERE email=?`, [req.body.email]);
    await sendToken(req.body.email, token);
    return res.status(201).json(newUser[0]);

  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

router.post('/update-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const [status] = await pool.query('UPDATE user SET password=?, token=NULL WHERE token=?', [hashedPassword, token]);
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

router.get('/:id', async (req, res) => {
  try {
    const candidatId = req.params.id;
    const [fiche] = await pool.query(`
    SELECT id, civility, lastname, firstname, description, diploma, cv1, cv2, job, linkedin, youtube, picture, availability, mobility, years_of_experiment, isCheck, create_at, update_at, isOpen_to_formation
    FROM user_fiche WHERE id = ?`, candidatId);
    if (!fiche) {
      return res.sendStatus(404);
    }
    const language = await pool.query(`SELECT l.id AS id_lang, l.language AS lang, ul.user_id AS user_id FROM language l JOIN user_language ul ON ul.language_id=l.id WHERE ul.user_id = ?`, candidatId);
    const sectors = await pool.query(`SELECT s.id AS id_sector, s.name AS name_sector, us.user_id AS user_id FROM sector_of_activity s JOIN user_sector_of_activity us ON us.sector_of_activity_id = s.id WHERE us.user_id = ?`, candidatId);
    const profileCandidat = {
      fiche: fiche,
      language: language,
      sector_of_activity: sectors
    }
    return res.status(200).json(profileCandidat);

  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const candidatToUpdateId = req.params.id;
    let ficheId;
    const [
      [fiche],
    ] = await pool.query('SELECT id FROM user_fiche WHERE user_id = ?', [
      candidatToUpdateId,
    ]);
    if (!fiche) {
      const [
        status,
      ] = await pool.query('INSERT INTO user_fiche (user_id) VALUES(?)', [
        candidatToUpdateId,
      ]);
      ficheId = status.insertId;
    } else {
      ficheId = fiche.id;
    }
    console.log(fiche, ficheId);

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
    } = req.body;

    await pool.query(`
    UPDATE user
    SET email = ?
    WHERE id = ?`,
      [email, candidatToUpdateId],
    );

    await pool.query(`
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
        ficheId,
      ],
    );

    const insertedLanguage = req.body.language;
    await pool.query(`DELETE FROM user_language WHERE user_id=?`, [candidatToUpdateId]);
    const insertedLangValues = insertedLanguage.map(langue => [candidatToUpdateId, langue.id]);
    await pool.query(`INSERT INTO user_language(user_id, language_id) VALUES ?`, [insertedLangValues]);

    const insertedSectors = req.body.sector_of_activity;
    await pool.query(`DELETE FROM user_sector_of_activity WHERE user_id=?`, [candidatToUpdateId]);
    const insertedSectorValues = insertedSectors.map(sector => [candidatToUpdateId, sector.id]);
    await pool.query(`INSERT INTO user_sector_of_activity(user_id, sector_of_activity_id) VALUES ?`, [insertedSectorValues]);

    return res.status(204).json(candidatToUpdateId);

  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;