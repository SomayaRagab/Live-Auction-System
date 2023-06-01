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
    auth.checkAdmin,
    controller.getAllUsers
    )
  .post(
    auth.checkAdmin,
    imageUpload.single('image'), validatePostArray, validateMW,controller.addUser)
  .patch(
    auth.checkUserORAdmin,
    imageUpload.single('image'), validateUpdateArray, validateMW,controller.updateUser)
  .delete(
    auth.checkUserORAdmin,
    validateMW,controller.deleteUser);

module.exports = router;
