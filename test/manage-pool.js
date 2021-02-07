require('../config');
const pool = require('../pool');

after(async () => {
  pool.end();
});
