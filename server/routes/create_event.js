'use strict';

let db = require('../config');

module.exports = function(req, res) {
  // create a random user as sub for
  let event = req.body;
  event.owner = req.user.user_id;

  // query the database for events
  db.one('INSERT into EVENTS (owner, title, short_desc, description, location, longitude, latitude, date, min)\
  VALUES (${owner}, ${title}, ${short_desc}, ${description}, ${location}, ${longitude}, ${latitude}, ${date}, ${min}) returning event_id', event)
  .then( (result) => {
    console.log('result from queryasync in create_event.js', result);
    res.status(201).json(result);
  })
  .catch( (err) => {
    res.status(404).send(err, "Invalid user_id, please login");
  });
};
