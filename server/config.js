'use strict';
const pgp = require('pg-promise')();
const makeSchema = require('./schema.js');
const database = 'youin';

if (process.env.HEROKU) {
  pgp.pg.defaults.ssl = true;

  let db = pgp(process.env.DATABASE_URL);

  makeSchema(db);
  module.exports = db;
} else {
  let db = pgp({
    database: database
  });

  makeSchema(db);
  module.exports = db;
}
