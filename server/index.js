'use strict';

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const morgan = require('morgan');
const server_api = require('./API');
const daoUser = require('./daoUser');

const app = express();
const port = 3001;

// middlewares

app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true
}
app.use(cors(corsOptions));
app.use(session({
  secret: 'ball do not lie',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.authenticate('session'));

//setup passport

passport.use(new LocalStrategy(function verify(username, password, done) {
  daoUser.getUser(username, password).then((user) => {
    if (!user)
      return done(null, false, { message: 'Incorrect username and/or password' });
    return done(null, user);
  })
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) { // user = id+email+name
  return cb(null, user);
  // if needed we can do checks (is user still in db?...)
});

server_api.registerAPIs(app, passport);

app.listen(port, () => console.log(`Server running on http://localhost:${port}/`));