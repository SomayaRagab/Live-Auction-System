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
.get(validateParamArray,itemDetailsController.getItemDetailsById)
.patch(validateParamArray,itemDetailsValidatePatchArray,itemDetailsController.updateItemDetails)
.delete(validateParamArray,itemDetailsController.deleteItemDetails);


module.exports = router;
