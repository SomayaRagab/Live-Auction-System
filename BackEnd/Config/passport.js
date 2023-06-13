const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./../Models/userModel');

passport.use(new FacebookStrategy({
    clientID: '1271772990442099',
    clientSecret:'eda962fd94036705489107269e647776',
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
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

passport.use(new GoogleStrategy({
    clientID: '195369114062-v1vqls6uilva2t7iipmuai87k0apkc4q.apps.googleusercontent.com',
    clientSecret:'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',
    callbackURL: "http://localhost:3000/auth/google/callback"
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