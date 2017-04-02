const pgp = require('pg-promise')();

module.exports = (db) => {
  return db.query('CREATE type status AS ENUM(\'pending\', \'accepted\', \'rejected\');')
  .catch( (err) => {
    if (err.code !== '42710') {
      throw err;
    }
  })
  .then( () => {
    return db.query('CREATE TABLE IF NOT EXISTS events (\
      event_id SERIAL not null PRIMARY KEY,\
      owner BIGINT NOT NULL,\
      title varChar(50),\
      short_desc varChar(50),\
      description varChar(255),\
      location varChar(255),\
      longitude BIGINT,\
      latitude BIGINT,\
      date varchar(500),\
      min INT);')
  })
  .then(() => {
    return db.query('CREATE TABLE IF NOT EXISTS users (\
      user_id BIGINT not null PRIMARY KEY,\
      token varChar(500),\
      firstname varChar(50),\
      lastname varChar(50),\
      photoUrl varChar(450),\
      email varChar(50));')
  })
  .then(() => {
    return db.query('CREATE TABLE IF NOT EXISTS users_events (\
      event_id int not null,\
      user_id BIGINT not null,\
      current_status status default \'pending\');')
  })
  .then(() => {
    return db.query('CREATE TABLE IF NOT EXISTS friends (\
      user1 BIGINT not null,\
      user2 BIGINT not null);')
  })
  .then(() => {
    return db.query('CREATE TABLE IF NOT EXISTS invites (\
      id SERIAL not null PRIMARY KEY,\
      user_id BIGINT not null,\
      name varChar(50),\
      email varChar(50),\
      CONSTRAINT unique_email_to_user_id unique (user_id, email));')
  })
  .then(() => {
    return db.query('CREATE TABLE IF NOT EXISTS dates (\
      id SERIAL not null PRIMARY KEY,\
      event_id int not null,\
      date varChar(500));')
  })
  .then(() => {
    return db.query('CREATE TABLE IF NOT EXISTS chats (\
      id SERIAL not null PRIMARY KEY,\
      user_id BIGINT not null,\
      firstname varChar(50),\
      event_id INT not null,\
      message varChar(400));')
  })
  .then(() => {
    return db.query('ALTER TABLE events ALTER column longitude type float;')
  })
  .then(() => {
    return db.query('ALTER TABLE events ALTER column latitude type float;')
  })
};
