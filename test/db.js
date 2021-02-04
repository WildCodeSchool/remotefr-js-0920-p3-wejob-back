const { each } = require('bluebird');
const pool = require('../pool');

function query(...args) {
  return pool.query(...args).then(([rows]) => rows);
}

function getTables() {
  const dbName = process.env.DB_NAME;
  const key = `Tables_in_${dbName}`;
  return query('SHOW TABLES').then((rows) =>
    rows.map(({ [key]: table }) => table),
  );
}

function truncateTable(table) {
  return query(`TRUNCATE ${table}`);
}

const delay = () => new Promise((resolve) => setTimeout(resolve), 20);

async function reset() {
  const tables = await getTables();
  await query('SET FOREIGN_KEY_CHECKS=0');
  await each(tables, truncateTable);
  await query('SET FOREIGN_KEY_CHECKS=0');
  // Seems to help prevent duplicate keys (tests )
  return delay();
}

module.exports = {
  query,
  reset,
};
