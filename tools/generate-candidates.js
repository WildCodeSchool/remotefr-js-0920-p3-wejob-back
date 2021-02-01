/* eslint-disable no-console */
const axios = require('axios');
const Promise = require('bluebird');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const pool = require('../pool');
const jobsBySector = require('./jobs-by-sector.json');

const sectorIds = Object.keys(jobsBySector).map((idStr) => Number(idStr));
const rndApiUrl = 'https://randomuser.me/api/';
const passwd = bcrypt.hashSync('Abcd1234', 5);

// Thanks StackOverflow: https://stackoverflow.com/q/19269545/
function getRandom(arr, n) {
  const result = new Array(n);
  let len = arr.length;
  const taken = new Array(len);
  let nn = n;
  if (n > len)
    throw new RangeError('getRandom: more elements taken than available');
  while (nn) {
    nn -= 1;
    const x = Math.floor(Math.random() * len);
    result[nn] = arr[x in taken ? taken[x] : x];
    len -= 1;
    taken[x] = len in taken ? taken[len] : len;
  }
  return result;
}

const allKeywords = [
  'Motivé',
  'Organisé',
  'Dynamique',
  'Autonome',
  'Rigoureux',
  "À l'écoute",
  'Résistance au stress',
];

const rand = (min, max) => min + Math.ceil((max - min) * Math.random());

const fetchRandomUsers = async (n) =>
  axios
    .get(`${rndApiUrl}?nat=fr&results=${n}`)
    .then(({ data }) => data.results);

const getLanguages = async () =>
  pool
    .query('SELECT id FROM language')
    .then(([languages]) => languages.map((l) => l.id));

const insertUser = async (email) =>
  pool
    .query('INSERT INTO user(email,password) VALUES(?, ?)', [email, passwd])
    .then(([status]) => status.insertId);

const insertCandidate = async (data) =>
  pool
    .query('INSERT INTO user_fiche SET ?', [data])
    .then(([status]) => status.insertId);

const insertUserRelations = async (table, relateeField, userId, relateeIds) => {
  const entries = relateeIds.map((relateeId) => [userId, relateeId]);
  return pool.query(`INSERT INTO ${table}(user_id,${relateeField}) VALUES ?`, [
    entries,
  ]);
};

let languageIds;

const generateSingleUser = async (user, i, count) => {
  console.log(`Generating ${i + 1} of ${count}`);

  const {
    name: { first: firstname, last: lastname },
    gender,
    email,
    picture: { large: picture },
  } = user;
  const userId = await insertUser(email);

  const numJobs = rand(1, 2);
  const numSectors = rand(1, 2);
  const candSectorIds = getRandom(sectorIds, numSectors);
  await insertUserRelations(
    'user_sector_of_activity',
    'sector_of_activity_id',
    userId,
    candSectorIds,
  );
  const job = candSectorIds
    .map((sid) => getRandom(jobsBySector[sid], numJobs))
    .flat()
    .join(';');
  const keywords = getRandom(allKeywords, 3).join(';');
  const userFicheData = {
    user_id: userId,
    civility: gender === 'male' ? 'Monsieur' : 'Madame',
    picture,
    firstname,
    lastname,
    job,
    keywords,
  };
  const numLangs = rand(1, 3);
  const candLangIds = getRandom(languageIds, numLangs);
  await insertUserRelations(
    'user_language',
    'language_id',
    userId,
    candLangIds,
  );
  const userFicheId = await insertCandidate(userFicheData);
  console.log(userId, userFicheId, firstname, lastname, gender, email, picture);
};

const generateUsers = async (n) => {
  try {
    languageIds = await getLanguages();
    const users = await fetchRandomUsers(n);
    await Promise.each(users, generateSingleUser);
    process.exit();
  } catch (err) {
    console.error(`Something bad happened: "${err.message}"`);
    process.exit(1);
  }
};

const count = Number(process.argv[2]) || 10;
generateUsers(count);
