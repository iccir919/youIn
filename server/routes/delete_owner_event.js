'use strict';

let db = require('../config');

module.exports = (req, res) => {
  let eventId = req.body['eventId'];
  console.log('event id from delete owner events', eventId);
  db.task(t=> {
        return t.batch([
            t.query('DELETE from users_events where event_id =$1', [eventId]),
            t.query('DELETE from events where event_id = $1', [eventId])
        ]);
    })
    .then(data=> {
        console.log('.thening')
        res.status(201).send(data);
    })
    .catch(error=> {
        // error
        console.log('error in delete_owner_events.js catch block', error)
        res.status(404).send();
    });

};
