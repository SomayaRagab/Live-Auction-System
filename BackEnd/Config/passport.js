const { default: mongoose } = require('mongoose');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('./../Models/userModel');
const User = mongoose.model('users');

passport.use(new FacebookStrategy({
    clientID: '1271772990442099',
    clientSecret:'eda962fd94036705489107269e647776',
    callbackURL: "http://localhost:8080/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    User.findOne({ facebookId: profile.id }, function(err, user) {
      if (err) { return done(err); }
      if (user) { return done(null, user); }
      const newUser = new User({
        name: profile.displayName,
        facebookId: profile.id
      });
      newUser.save(function(err) {
        if (err) { return done(err); }
        done(null, newUser);
      });
    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: '195369114062-5bmk8o6kdfkrnpelsk7rlpdn53r3s2b1.apps.googleusercontent.com',
    clientSecret:'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',
    callbackURL: "http://localhost:8080/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ googleId: profile.id }, function(err, user) {
      if (err) { return done(err); }
      if (user) { return done(null, user); }
      const newUser = new User({
        name: profile.displayName,
        googleId: profile.id
      });
      newUser.save(function(err) {
        if (err) { return done(err); }
        done(null, newUser);
      });
    });
  }
));

module.exports = passport;