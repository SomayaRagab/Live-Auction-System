const express = require('express');
const controller = require('./../Controllers/usersController');
const validateMW = require('./../Validations/validateMW');
const { validatePostArray } = require('./../Validations/userValidationArray');
const multer = require('multer');
const upload = multer();
const router = express.Router();

router
  .route('/signup')
  .post(upload.single('image'), validatePostArray,validateMW, controller.addUser);

module.exports = router;
