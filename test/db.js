const pool = require('../pool');

function query(...args) {
  return pool.query(...args).then(([rows]) => rows);
}

function getTables() {
  return query('SHOW TABLES').then((rows) =>
    rows.map(({ Tables_in_database_name: table }) => table),
  );
}

function reset() {
  getTables().then(console.log);
  return Promise.resolve();
}

module.exports = {
  query,
  reset,
  close: pool.end.bind(pool),
};
