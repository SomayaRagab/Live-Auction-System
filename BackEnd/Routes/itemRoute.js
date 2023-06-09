const express = require('express');
const validateMW = require('./../Validations/validateMW');
const itemController = require('./../Controllers/itemsController');
const { checkAdmin, checkUserORAdmin } = require('../Middleware/authorization');
const validateParamArray = require('./../Validations/paramValidationArray');
const {
  itemValidatePostArray,
  itemValidatePatchArray,
} = require('./../Validations/itemValidateArray');
const uploadImage = require('../Helper/uploadingImages');
const imageUpload = uploadImage('item');

const router = express.Router();

router
  .route('/items')
  .get(checkUserORAdmin, itemController.getAllItems)
  .post(
    checkAdmin,
    imageUpload.single('image'),
    itemValidatePostArray,
    validateMW,
    itemController.addItem
  );

router
  .route('/items/:id')
  .get(checkUserORAdmin, validateParamArray, itemController.getItem)
  .patch(
    checkAdmin,
    imageUpload.single('image'),
    validateParamArray,
    itemValidatePatchArray,
    validateMW,
    itemController.updateItem
  )
  .delete(checkAdmin, validateParamArray, itemController.deleteItem);

module.exports = router;
