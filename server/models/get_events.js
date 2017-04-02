let db = require('../config');

module.exports = (id) => {
  let query = 'SELECT events.event_id,\
  events.owner,\
  events.title,\
  events.short_desc,\
  events.description,\
  events.location,\
  events.longitude,\
  events.latitude,\
  events.date,\
  events.min\
  FROM EVENTS INNER JOIN users_events \
  ON users_events.user_id=$1 AND events.event_id = users_events.event_id';

  return db.task( (t) => {
    return t.map(query, [id], (event) => {
      
      let query = 'SELECT users.user_id, users.firstname, users.lastname, users.photoUrl FROM users \
      INNER JOIN users_events ON users_events.current_status = \'accepted\' \
      AND users_events.event_id=$1 AND users.user_id=users_events.user_id';
      
      return t.manyOrNone(query, event.event_id)
        .then( (attendees) => {
          event.attendees = attendees;
          return event;
        })
        .catch( (err) => {
          console.log('error in users_events table query', err);
        });
    })
    .then(t.batch)
    .then( (results) => {
      let events = { ownerEvents: [], friendEvents: []};
      results.forEach( (event) => {
        events[event.owner === id ? 'ownerEvents' : 'friendEvents'].push(event);
      });
      return events;
    })
    .catch( (err) => {
      console.log('error in events table query', err);
    })
  })
}