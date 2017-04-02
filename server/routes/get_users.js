'use strict';

let db = require('../config');

module.exports = function(req, res) {
  db.query('select * from users')
  .then ( (users) => {
    res.status(200).json(users);
  })
  .catch( (err) => {
    res.status(500).send(err, 'Error in get_users handler function');
  })

}
