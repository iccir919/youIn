'use strict';

let db = require('../config');

module.exports = function(req, res) {
  var user_ids = JSON.parse(req.query.user_ids);
  var offset = 1;
  var placeholders = user_ids.map(function(name,i) {
      return '$'+(i+offset);
  }).join(',');
  var emailQuery = `select email from users where user_id=any('{${placeholders}}')`;

  db.query(emailQuery, user_ids)
  .then ( (users) => {
    res.send(users);
    // res.status(200).json(users);
  })
  .catch( (err) => {
    res.status(500).send(err, 'Error in get_users handler function');
  })
};
