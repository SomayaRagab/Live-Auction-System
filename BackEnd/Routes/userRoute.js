const express = require('express');
const controller = require('./../Controllers/usersController');
const validateMW = require('./../Validations/validateMW');
const auth = require('./../Middleware/authorization');
const {
  validatePostArray,
  validatePatchArray,
} = require('./../Validations/userValidationArray');
const validateParamArray = require('./../Validations/paramValidationArray');
const {
  checkAdmin,
  checkUser,
  checkUserORAdmin,
} = require('../Middleware/authorization');

const uploadImage = require('../Helper/uploadingImages');
const imageUpload = uploadImage('user');
const router = express.Router();

router
  .route('/users')
  .get(checkAdmin, controller.getAllUsers)
  .post(
    // checkAdmin,
    imageUpload.single('image'),
    validatePostArray,
    controller.addUser
  );

router
  .route('/users/:id')
  .get(checkUserORAdmin, validateParamArray, validateMW, controller.getUser)
  .patch(
    checkUserORAdmin,
    validateParamArray,
    imageUpload.single('image'),
    validatePatchArray,
    validateMW,
    controller.updateUser
  )
  .delete(checkAdmin, validateParamArray, validateMW, controller.deleteUser);

router
  .route('/users/:id/block')
  .patch(validateParamArray, validateMW, controller.blockOrUnblockUser);

module.exports = router;
