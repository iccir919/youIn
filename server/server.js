'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let passport = require('./middleware/initPassport');
let path = require('path');
let handler = require('./routes/request_handler');
// var queries = require('/models/socket_queries');

let port = process.env.PORT || 8080;
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session( {
  secret: 'I didn\'t get Inception',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', express.static(path.join(__dirname, '../src/client')));

app.get('/events', passport.authenticate('facebook-token'), handler.getEvents);

app.get('/users', handler.getUsers);

app.get('/user', passport.authenticate('facebook-token'), handler.getUser);

app.get('/chatRoom', passport.authenticate('facebook-token'), handler.getChat);

app.post('/events/users', passport.authenticate('facebook-token'), handler.addUsersEvents);

app.get('/events/users/emails', passport.authenticate('facebook-token'), handler.getAttendeesEmails);

app.post('/events/create', passport.authenticate('facebook-token'), handler.createEvent);

app.post('/accept', passport.authenticate('facebook-token'), handler.acceptEvent);

app.post('/reject', passport.authenticate('facebook-token'), handler.rejectEvent);

app.post('/delete', passport.authenticate('facebook-token'), handler.deleteEvent);

app.post('/delete/owner', passport.authenticate('facebook-token'), handler.deleteOwnerEvent);

app.post('/checkStatus', passport.authenticate('facebook-token'), handler.checkStatus);

app.post('/chatRoom', passport.authenticate('facebook-token'), handler.insertChat);

//handle invites-related get and post requests
app.get('/invites', passport.authenticate('facebook-token'), handler.inviteeList);

app.post('/invites', passport.authenticate('facebook-token'), handler.invites);
app.post('/invites', passport.authenticate('facebook-token'), handler.invites);

app.get('/dates', passport.authenticate('facebook-token'), handler.dateVotes);

app.post('/dates', passport.authenticate('facebook-token'), handler.dates);

app.get('/test', passport.authenticate('facebook-token'), function(req, res) {
  if (req.user) {
    res.status(200).json(
      { message: 'success',
        user: req.user
      });
  } else {
    res.status(404).send('login failed');
  }
});

app.get('*', handler.wildCard);

var server = app.listen(port, function() {
  console.log('we are now listening on: ' + port);
});


var io = require('socket.io').listen(server);
io.on('connection', function(socket){
  socket.on('sentMessage', function(){
    socket.broadcast.emit('newMessage');
  });
});
