const express = require('express');
const validateMW = require('./../Validations/validateMW');
const itemController = require('./../Controllers/itemsController');
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
  .get(itemController.getAllItems)
  .post(
    imageUpload.single('image'),
    itemValidatePostArray,
    validateMW,
    itemController.addItem
  );

router
  .route('/items/:id')
  .get(validateParamArray , itemController.getItem)
  .patch(
    imageUpload.single('image'),
    validateParamArray,
    itemValidatePatchArray,
    validateMW,
    itemController.updateItem
  )
  .delete(validateParamArray , itemController.deleteItem);

module.exports = router;
