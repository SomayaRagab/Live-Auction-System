const express = require('express');
const multer = require('multer');
const upload = multer();
const controller = require('./../Controllers/usersController');
const validateMW = require('./../Validations/validateMW');
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

const router = express.Router();

router
  .route('/users')
  .get(checkAdmin, controller.getAllUsers)
  .post(
    checkAdmin,
    upload.single('image'),
    validatePostArray,
    controller.addUser
  );

router
  .route('/users/:id')
  .get(checkUserORAdmin, validateParamArray, validateMW, controller.getUser)
  .patch(
    checkUserORAdmin,
    upload.single('image'),
    validateParamArray,
    validatePatchArray,
    validateMW,
    controller.updateUser
  )
  .delete(checkAdmin, validateParamArray, validateMW, controller.deleteUser);

router
  .route('/users/:id/block')
  .patch(
    checkAdmin,
    validateParamArray,
    validateMW,
    controller.blockOrUnblockUser
  );

module.exports = router;
