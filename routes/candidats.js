const express = require('express');

const router = express.Router();

const pool = require('../pool');

const urlApiUsers = '/api/candidats/';

router.get('/', async (req, res) => {
  try {
    const [fiches] = await pool.query(`
    SELECT id, lastname, firstname, description, picture, availability, mobility, isCheck
    FROM user_fiche`);
    const [jobs] = await pool.query(`
    SELECT j.id AS id_job, j.name AS name_job, uj.user_id AS user_id FROM job j JOIN user_job uj ON uj.job_id=j.id`);
    const [language] = await pool.query(`SELECT l.id AS id_lang, l.language AS lang, ul.user_id AS user_id FROM language l JOIN user_language ul ON ul.language_id=l.id`);
    const [sectors] = await pool.query(`SELECT s.id AS id_sector, s.name AS name_sector, us.user_id AS user_id FROM sector_of_activity s JOIN user_sector_of_activity us ON us.sector_of_activity_id = s.id`);

    const fichesCandidats = fiches.map(f => {
      const jobToUSer = jobs.filter(j => j.user_id === f.id);
      const langToUSer = language.filter(l => l.user_id === f.id);
      const sectorToUSer = sectors.filter(s => s.user_id === f.id);
      return {
        ...f,
        job: jobToUSer,
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
    await pool.query('INSERT INTO user (email) VALUES (?)', [req.body.email]);
    const newUser = await pool.query(`SELECT id, email FROM user WHERE email=?`, [req.body.email]);
    return res.status(201).json(newUser[0]);

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
    SELECT id, lastname, firstname, description, diploma, cv, linkedin, youtube, picture, availability, mobility, years_of_experiment, isCheck, create_at, update_at, isOpen_to_formation
    FROM user_fiche WHERE id = ?`, candidatId);
    if (fiche.length === 0) {
      return res.sendStatus(404);
    }
    const [jobs] = await pool.query(`
    SELECT j.id AS id_job, j.name AS name_job, uj.user_id AS user_id FROM job j JOIN user_job uj ON uj.job_id=j.id WHERE uj.user_id = ?`, candidatId);
    const [language] = await pool.query(`SELECT l.id AS id_lang, l.language AS lang, ul.user_id AS user_id FROM language l JOIN user_language ul ON ul.language_id=l.id WHERE ul.user_id = ?`, candidatId);
    const [sectors] = await pool.query(`SELECT s.id AS id_sector, s.name AS name_sector, us.user_id AS user_id FROM sector_of_activity s JOIN user_sector_of_activity us ON us.sector_of_activity_id = s.id WHERE us.user_id = ?`, candidatId);
    const profileCandidat = {
      fiche: fiche,
      job: jobs,
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
    // the reference id is "user_fiche.id"

    const { email, lastname, firstname, description, diploma, cv, linkedin, youtube, picture, availability, mobility, years_of_experiment, isCheck, update_at, isOpen_to_formation, activity_area, name_sector, name_job } = req.body;

    //tested: ok
    const [emailUpdated] = await pool.query(`
    UPDATE user
    INNER JOIN user_fiche
    ON user.id=user_fiche.id
    SET user.email = ?
    WHERE user_fiche.id = ?`, [email, candidatToUpdateId]);

    //tested: ok
    // we don't modify create_at :
    const [userFicheUpdated] = await pool.query(`
    UPDATE user_fiche
    SET lastname="?", firstname="?", description="?", diploma="?", cv="?", linkedin="?", youtube="?", picture="?", availability="?", mobility="?", years_of_experiment="?", isCheck="?", update_at="?", isOpen_to_formation="?"
    WHERE id = ?`, [lastname, firstname, description, diploma, cv, linkedin, youtube, picture, availability, mobility, years_of_experiment, isCheck, update_at, isOpen_to_formation, candidatToUpdateId]);

    //tested: ok
    const [activityAreaUpdated] = await pool.query(`
     UPDATE user_fiche
     SET user_fiche.activity_area_id = ? 
     WHERE user_fiche.id = ?`, [activity_area, candidatToUpdateId]);


    /*   ---------------  need POST, DELETE and PUT for job, sector_of_activity and language ?  --------------- 
        const [jobUpdated] = await pool.query(`
        UPDATE job
        LEFT JOIN user_job
        ON job.id = user_job.job_id
        LEFT JOIN user_fiche
        ON user_job.user_id=user_fiche.id
        SET job.name = ? 
        WHERE user_fiche.id = ?`, [name_job, candidatToUpdateId]);
    
        const [languageUpdated] = await pool.query(`
        UPDATE language
        LEFT JOIN user_language
        ON language.id = user_language.language_id
        LEFT JOIN user_fiche
        ON user_language.user_id=user_fiche.id
        SET language.language = ? 
        WHERE user_fiche.id = ?`, [name_job, candidatToUpdateId]);
    
        const [sectorOfActivityUpdated] = await pool.query(`
        UPDATE sector_of_activity
        LEFT JOIN user_sector_of_activity
        ON sector_of_activity.id = user_sector_of_activity.sector_of_activity_id
        LEFT JOIN user_fiche
        ON user_sector_of_activity.id=user_fiche.id
        SET sector_of_activity.name = ? 
        WHERE user_fiche.id = ?`, [name_sector, candidatToUpdateId]);*/

    const updatedProfileCandidat = {
      email: emailUpdated,
      fiche: userFicheUpdated,
      activity_area: activityAreaUpdated,
      // job: jobUpdated,
      // language: languageUpdated,
      // sector_of_activity: sectorOfActivityUpdated,
    }
    return res.status(204).json(updatedProfileCandidat);

  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;