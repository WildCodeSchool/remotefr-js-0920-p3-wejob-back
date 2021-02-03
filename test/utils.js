const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config({
  path: path.resolve(__dirname, '..', '.env'),
});

const { query } = require('./db');

const getUser = async (idOrEmail) => {
  const [
    user,
  ] = await query(
    'SELECT id, email, isAdmin FROM user WHERE id = ? OR email = ?',
    [idOrEmail, idOrEmail],
  );
  return { ...user };
};

const createUser = async (email, isAdmin = false) => {
  const password = await bcrypt.hash('Zyx765**', 10);
  const { insertId } = await query('INSERT INTO user SET ?', [
    { email, isAdmin, password },
  ]);
  return getUser(insertId);
};

const login = async (email) => {
  const [user] = await getUser(email);
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: 5000 });
};

const createAndLogin = async (email, isAdmin = 0) => {
  const user = await createUser(email, isAdmin);
  const token = await jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: 5000,
  });
  return { ...user, token };
};

module.exports = {
  createUser,
  login,
  createAndLogin,
};
