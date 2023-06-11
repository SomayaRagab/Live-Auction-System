const express = require('express');
const validateMW = require('./../Validations/validateMW');
const itemController = require('./../Controllers/itemsController');
const { checkAdmin, checkUserORAdmin } = require('../Middleware/authorization');
const validateParamArray = require('./../Validations/paramValidationArray');
const {
  itemValidatePostArray,
  itemValidatePatchArray,
} = require('./../Validations/itemValidateArray');
const multer = require('multer');
const upload = multer();

const router = express.Router();

router
  .route('/items')
  .get(checkUserORAdmin, itemController.getAllItems)
  .post(
    checkAdmin,
    upload.single('image'),
    itemValidatePostArray,
    validateMW,
    itemController.addItem
  );

router
  .route('/items/:id')
  .get(checkUserORAdmin, validateParamArray,validateMW, itemController.getItem)
  .patch(
    checkAdmin,
    upload.single('image'),
    validateParamArray,
    itemValidatePatchArray,
    validateMW,
    itemController.updateItem
  )
  .delete(checkAdmin, validateParamArray,validateMW, itemController.deleteItem);

router
  .route('/items/autocomplete/:name')
  .get(checkUserORAdmin, itemController.autocompleteItem);


 router.route('/category/:id/items')
    .get(checkUserORAdmin ,validateParamArray , itemController.getItemsByCategory);
module.exports = router;
