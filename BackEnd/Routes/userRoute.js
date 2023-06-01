const express = require('express');
const controller = require('./../Controllers/usersController');
const validateMW = require('./../Validations/validateMW');
const { validatePostArray, validateUpdateArray } = require('./../Validations/userValidationArray');
const uploadImage = require('../Helper/uploadingImages');
const imageUpload = uploadImage('user');

const router = express.Router();

router
  .route('/users')
  .get(controller.getAllUsers)
  .post(imageUpload.single('image'), validatePostArray, validateMW,controller.addUser)
  .patch(imageUpload.single('image'), validateUpdateArray, validateMW,controller.updateUser)
  .delete(validateMW,controller.deleteUser);

module.exports = router;
