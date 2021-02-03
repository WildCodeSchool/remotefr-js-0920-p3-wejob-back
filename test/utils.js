const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({
  path: path.resolve(__dirname, '..', '.env'),
});

console.log(path.resolve(__dirname, '..', '.env'));
const { query } = require('./db');

console.log(process.env.DB_HOST);

const createUser = async (email, isAdmin = false) => {
  const password = await bcrypt.hash('Zyx765**', 10);
  return query('INSERT INTO user SET ?', [{ email, isAdmin, password }]);
};

createUser('pouet@pouet.com');

module.exports = {
  createUser,
};
