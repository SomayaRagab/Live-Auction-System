const controller = require('../Controllers/bindingController');
const express = require('express');
const router = express.Router();
const { biddingValidatePostArray, biddingValidatePatchArray } = require('../Validations/biddingValidationArray');
const validateMW = require('./../Validations/validateMW');


router.route('/biddings')
    .post(biddingValidatePostArray, validateMW, controller.addBidding);


module.exports = router;
