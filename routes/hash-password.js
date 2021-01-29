const bcrypt = require('bcryptjs');

async function hashPassword(passwordToHash) {
  return bcrypt.hash(passwordToHash, 14);
}

module.exports = hashPassword;