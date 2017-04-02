'use strict';

let db = require('../config');

module.exports = function(req, res) {
  let userIds = req.body.userIds;
  let eventId = req.body.eventId;


db.task(t => {

  return t.batch(
    userIds.map(id => {
      return t.query('INSERT into USERS_EVENTS (event_id, user_id) VALUES ($1, $2)', [eventId, id])
    })
  )
  .then( () => {
    return t.query('INSERT into USERS_EVENTS (event_id, user_id, current_status) VALUES ($1, $2, $3)', [eventId, req.user.user_id, 'accepted'])
  });


})
.then((result) => res.status(201).send('updated users_events table') );

};
