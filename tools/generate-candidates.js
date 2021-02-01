/* eslint-disable no-console */
const axios = require('axios');
const Promise = require('bluebird');
require('dotenv').config();
const pool = require('../pool');

const rndApiUrl = 'https://randomuser.me/api/';
const passwd = 'Abcd1234';

const fetchRandomUsers = async (n) =>
  axios.get(`${rndApiUrl}?results=${n}`).then(({ data }) => data.results);

const insertUser = async (email) =>
  pool
    .query('INSERT INTO user(email,password) VALUES(?, ?)', [email, passwd])
    .then(([status]) => status.insertId);

const insertCandidate = async (data) =>
  pool
    .query('INSERT INTO user_fiche SET ?', [data])
    .then(([status]) => status.insertId);

const generateSingleUser = async (user, i, count) => {
  console.log(`Generating ${i + 1} of ${count}`);
  const {
    name: { first: firstname, last: lastname },
    gender,
    email,
    picture: { large: picture },
  } = user;
  const userId = await insertUser(email);
  const userFicheData = {
    user_id: userId,
    civility: gender === 'male' ? 'Monsieur' : 'Madame',
    picture,
    firstname,
    lastname,
  };
  const userFicheId = await insertCandidate(userFicheData);
  console.log(userId, userFicheId, firstname, lastname, gender, email, picture);
};

const generateUsers = async (n) => {
  try {
    const users = await fetchRandomUsers(n);
    await Promise.each(users, generateSingleUser);
    process.exit();
  } catch (err) {
    console.error(`Something bad happened: "${err.message}"`);
    process.exit(1);
  }
};

const count = Number(process.argv[2]) || 1;
generateUsers(count);
