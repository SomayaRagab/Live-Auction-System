const express = require('express');
const validateMW = require('./../Validations/validateMW');
const itemDetailsController = require('./../Controllers/itemDetailsController');
const validateParamArray = require('./../Validations/paramValidationArray');


const {
    itemDetailsValidatePostArray,
    itemDetailsValidatePatchArray,
} = require('./../Validations/itemDetailsValidateArray');

const router = express.Router();

router.route('/itemDetails')
.get(itemDetailsController.getItemDetails)
.post(itemDetailsValidatePostArray,validateMW,itemDetailsController.createItemDetails);

router.route('/itemDetails/:id')
.get(validateParamArray,validateMW,itemDetailsController.getItemDetailsById)
.patch(validateParamArray,itemDetailsValidatePatchArray,validateMW,itemDetailsController.updateItemDetails)
.delete(validateParamArray,validateMW,itemDetailsController.deleteItemDetails);


module.exports = router;
