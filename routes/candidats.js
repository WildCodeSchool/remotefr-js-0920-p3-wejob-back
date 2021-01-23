const express = require('express');

const router = express.Router();

const pool = require('../pool');

const urlApiUsers = '/api/candidats/';

router.get('/', async (req, res) => {
  try {
    const [fiches, fieldFiches] = await pool.query(`
    SELECT id, lastname, firstname, description, picture, availability, mobility, isCheck
    FROM user_fiche`);
    const [jobs, fieldJobs] = await pool.query(`
    SELECT j.id AS id_job, j.name AS name_job, uj.user_id AS user_id FROM job j JOIN user_job uj ON uj.job_id=j.id`);
    const [language, fieldLanguage] = await pool.query(`SELECT l.id AS id_lang, l.language AS lang, ul.user_id AS user_id FROM language l JOIN user_language ul ON ul.language_id=l.id`);
    const [sectors, fieldsSector] = await pool.query(`SELECT s.id AS id_sector, s.name AS name_sector, us.user_id AS user_id FROM sector_of_activity s JOIN user_sector_of_activity us ON us.sector_of_activity_id = s.id`);

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
      error: err.message,
    });
  }
});



router.get('/:id', async (req, res) => {
  try {
    const candidatId = req.params.id;
    console.log("candidatId = " + candidatId);
    const [fiche, fieldFiches] = await pool.query(`
    SELECT id, lastname, firstname, description, diploma, cv, linkedin, youtube, picture, availability, mobility, years_of_experiment, isCheck, create_at, update_at, isOpen_to_formation
    FROM user_fiche WHERE id = ?`, candidatId);
    const [jobs, fieldJobs] = await pool.query(`
    SELECT j.id AS id_job, j.name AS name_job, uj.user_id AS user_id FROM job j JOIN user_job uj ON uj.job_id=j.id WHERE uj.user_id = ?`, candidatId);
    const [language, fieldLanguage] = await pool.query(`SELECT l.id AS id_lang, l.language AS lang, ul.user_id AS user_id FROM language l JOIN user_language ul ON ul.language_id=l.id WHERE ul.user_id = ?`, candidatId);
    const [sectors, fieldsSector] = await pool.query(`SELECT s.id AS id_sector, s.name AS name_sector, us.user_id AS user_id FROM sector_of_activity s JOIN user_sector_of_activity us ON us.sector_of_activity_id = s.id WHERE us.user_id = ?`, candidatId);
    const profileCandidat = {
      fiche: fiche,
      job: jobs,
      language: language,
      sector_of_activity: sectors
    }
    return res.status(200).json(profileCandidat);
  } catch (error) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

router.put('/:id', (req, res) => {
  pool.query(`
  UPDATE user_fiche SET ? 
  WHERE id=?
  `, [req.body, req.params.id], (err) => {
    if (err) {
      res.status(500).json({
        error: err.message,
      });
    }
    return res
      .status(204)
      .json(modifiedUser);
  });
});

router.post('/', (req, res) => {
  pool.query('INSERT INTO user_fiche SET ?', [req.body], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    return pool.query('SELECT * FROM user WHERE id = ?', results.insertId, (err2, results2) => {
      if (err2) {
        return res.status(500).json({
          error: err2.message,
          sql: err2.sql,
        });
      }
      const host = req.get('host');
      const location = `http://${host}${urlApiUsers}${results.insertId}`;
      return res
        .status(201)
        .set('Location', location)
        .json(results2);
    });
  });
});

router.delete('/:id', (req, res) => {
  pool.query('DELETE FROM user_fiche WHERE id=?', req.params.id, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    return res.sendStatus(204);
  });
});

module.exports = router;