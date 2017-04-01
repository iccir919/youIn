let passport = require('passport');
let FacebookTokenStrategy = require('passport-facebook-token');
let db = require('../config.js');

passport.use(new FacebookTokenStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
}, function(accessToken, refreshToken, profile, done) {
  let id = +profile.id;
  db.query('SELECT * FROM users WHERE user_id = $1', [id])
    .then((user) => {
      if (user.length > 0) {
        done(null, user[0]);
      } else {
        let user = {
          user_id: +profile.id,
          token: accessToken,
          firstname: profile.name.givenName,
          lastname: profile.name.familyName,
          photoUrl: profile.photos[0].value,
          email: (profile.emails[0].value || '').toLowerCase()
        };

        db.query('INSERT INTO users VALUES (${user_id}, ${token}, ${firstname}, ${lastname}, ${photoUrl}, ${email})', user)
          .then( (result) => {
            db.query('SELECT * FROM users WHERE user_id = $1', [user.user_id])
              .then( (user) => {
                 done(null, user[0][0]);
              })
          })
          .catch( (err) => {
            done(err, false, {message: 'Facebook authorization failed'});
          })
        }
    })
    .catch( (err) => {
      console.log(err, 'it fails in catch')
      done(err, null);
    });
  }
));

passport.serializeUser(function(user, done){
    done(null, user.user_id);
});

passport.deserializeUser(function(id, done){
    db.query('SELECT * FROM users WHERE user_id = $1', [id])
    .then( (user) => {
      done(null, user[0])
    })
});

module.exports = passport;
