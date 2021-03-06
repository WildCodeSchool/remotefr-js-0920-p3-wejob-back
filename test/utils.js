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

const getUserFiche = async (userId) => {
  const [
    userFiche,
  ] = await query(
    'SELECT u.id as user_id, u.email, uf.* FROM user u JOIN user_fiche uf ON u.id = uf.user_id WHERE u.id = ?',
    [userId],
  );
  const { user_id: id, id: ficheId, ...rest } = userFiche;
  return { id, ficheId, ...rest };
};

const getNextId = (() => {
  let nextId = 0;
  return () => {
    nextId += 1;
    return nextId;
  };
})();

const createUser = async (isAdmin = false) => {
  const password = await bcrypt.hash('Zyx765**', 8);
  const email = `foo${getNextId()}@b.ar`;
  const { insertId } = await query('INSERT INTO user SET ?', [
    { email, isAdmin, password },
  ]);
  return getUser(insertId);
};

const login = async (email) => {
  const [user] = await getUser(email);
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: 5000 });
};

const createAndLogin = async (isAdmin = 0) => {
  const user = await createUser(isAdmin);
  const token = await jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: 5000,
  });
  return { ...user, token };
};

const recruiterLogin = async () => {
  const email = `rec${getNextId()}@b.ar`;
  const token = await jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: 5000,
  });
  return { email, token };
};

module.exports = {
  createUser,
  login,
  createAndLogin,
  getUserFiche,
  recruiterLogin,
};
