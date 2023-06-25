const { response } = require('express');
const { default: mongoose } = require('mongoose');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('./../Models/userModel');
const User = mongoose.model('users');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('./env');


function authResponse(id, role, response) {
  // console.log("authResponse");
  let token = jwt.sign({ id: id, role: role }, SECRET_KEY, { expiresIn: '1h' });
  console.log(token);
  response.status(200).json({
    message: 'Authenticated',
    token,
  });
}


passport.use(new FacebookStrategy({
  clientID: '1271772990442099',
  clientSecret: 'eda962fd94036705489107269e647776',
  callbackURL: "http://auction.nader-mo.tech/facebook/callback",
  passReqToCallback: true // Add this option
},
function(req, accessToken, refreshToken, profile, done) {
  console.log(profile);
  User.findOne({ facebookId: profile.id }, function(err, user) {
    if (err) { return done(err); }
    if (user) {
      let token = jwt.sign({ id: user._id, role: 'user' }, SECRET_KEY, { expiresIn: '1h' });
      req.token = token;
      return done(null, user, token);
    } else {
      const newUser = new User({
        name: profile.displayName,
        facebookId: profile.id
      });

      newUser.save(function(err) {
        if (err) { return done(err); }
        let token = jwt.sign({ id: newUser._id, role: 'user' }, SECRET_KEY, { expiresIn: '1h' });
        req.token = token;
        done(null, newUser, token);
      });
    }
  });
}));


passport.serializeUser(function(user, done) {
done(null, user._id);
});

passport.deserializeUser(function(id, done) {
User.findById(id, function(err, user) {
  done(err, user);
});
});

passport.use(new GoogleStrategy({
  clientID: '195369114062-5bmk8o6kdfkrnpelsk7rlpdn53r3s2b1.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: "http://auction.nader-mo.tech/google/callback"
},
function(accessToken, refreshToken, profile, done) {
  console.log(profile);
  User.findOne({ googleId: profile.id }, function(err, user) {
    if (err) { return done(err); }
    if (user) {
      let token = jwt.sign({ id: user._id, role: 'user' }, SECRET_KEY, { expiresIn: '1h' });
      req.token = token;
      return done(null, user, token);
    }
    if (!profile.emails || profile.emails.length === 0) {
      return done(new Error("البريد الإلكتروني غير متوفر في ملف Google الشخصي"));
    }
    const newUser = new User({
      name: profile.displayName,
      email: profile.emails[0].value,
      googleId: profile.id
    });
    newUser.save(function(err) {
      if (err) { return done(err); }
      let token = jwt.sign({ id: newUser._id, role: 'user' }, SECRET_KEY, { expiresIn: '1h' });
      req.token = token;
      done(null, newUser, token);
    });
  });
}));




module.exports = passport;