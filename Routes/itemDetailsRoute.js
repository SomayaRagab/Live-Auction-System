const express = require('express');
const validateMW = require('./../Validations/validateMW');
const itemDetailsController = require('./../Controllers/itemDetailsController');
const validateParamArray = require('./../Validations/paramValidationArray');
const {checkAdmin , checkUserORAdmin} = require('../Middleware/authorization');

const {
    itemDetailsValidatePostArray,
    itemDetailsValidatePatchArray,
} = require('./../Validations/itemDetailsValidateArray');

const router = express.Router();

router.route('/itemDetails')
.get(checkUserORAdmin ,itemDetailsController.getItemDetails)
.post(checkAdmin ,itemDetailsValidatePostArray,validateMW,itemDetailsController.createItemDetails);


router.route('/itemDetails/:id')
.get(checkUserORAdmin ,validateParamArray,itemDetailsController.getItemDetailsById)
.patch(checkAdmin,validateParamArray,itemDetailsValidatePatchArray,itemDetailsController.updateItemDetails)
.delete(checkAdmin ,validateParamArray,itemDetailsController.deleteItemDetails);

// all auction items
router.route('/auctions/:id/items')
.get(checkUserORAdmin ,validateParamArray,validateMW,itemDetailsController.getItemDetailsByAuctionId);

router.route('/itemflag/:id')
.post(validateParamArray,itemDetailsController.changeFlag);

module.exports = router;
