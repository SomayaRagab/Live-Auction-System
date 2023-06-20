const express = require('express');
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('../Config/env');
const passport = require('./../Config/passport');
const router = express.Router();

router.get('/facebook', passport.authenticate('facebook'));

// router.get('/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     // console.log('here');
//     // console.log(req.token);
//     // console.log(req);
//     // // Successful authentication, redirect home.
//     // res.token = req.token;
//     // console.log(res.token)
//     // let token =res.token
//     // let decodedToken = jwt.verify(token, SECRET_KEY);
//     //     req.id = decodedToken.id;
//     //     req.role = decodedToken.role;                       
//     // console.log(res.get("authorization"));
//     console.log(req.token);
//     // console.log("here");
//     res.render("authorization", {token: req.token});
//   }
//   );

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.json({ token: req.token });
  }
);


router.get('/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

module.exports = router;
