const express = require('express');
const multer = require('multer');
const upload = multer();
const router = express.Router();
const controller = require('./../Controllers/usersController');
const validateMW = require('./../Validations/validateMW');
const {validatePostArray,validatePatchArray} = require('./../Validations/userValidationArray');
const validateParamArray = require('./../Validations/paramValidationArray');
const {checkAdmin, checkUser, checkUserORAdmin} = require('../Middleware/authorization');

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
    validateParamArray,
    upload.single('image'),
    validatePatchArray,
    validateMW,
    controller.updateUser
  )
  .delete(checkUserORAdmin, validateParamArray, validateMW, controller.deleteUser);

router
  .route('/users/:id/block')
  .patch(checkAdmin, validateParamArray, validateMW, controller.blockOrUnblockUser);

module.exports = router;
