const express = require('express');
const controller = require('./../Controllers/usersController');
const validateMW = require('./../Validations/validateMW');
const auth = require('./../Middleware/authorization');
const { validatePostArray, validateUpdateArray } = require('./../Validations/userValidationArray');
const uploadImage = require('../Helper/uploadingImages');
const imageUpload = uploadImage('user');
const router = express.Router();

router
  .route('/users')
  .get(
    controller.getAllUsers
    )
  .post(
    imageUpload.single('image'), validatePostArray,controller.addUser)
  .patch(
    imageUpload.single('image'), validateUpdateArray,controller.updateUser)
  .delete(
   controller.deleteUser);

module.exports = router;
