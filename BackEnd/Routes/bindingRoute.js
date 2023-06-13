const controller = require('../Controllers/bindingController');
const express = require('express');
const router = express.Router();
const { biddingValidatePostArray, biddingValidatePatchArray } = require('../Validations/biddingValidationArray');
const validateMW = require('./../Validations/validateMW');


router.route('/biddings')
    .post(biddingValidatePostArray, validateMW, controller.addBidding);

router.route('/biddings')
     .get(controller.getAllBiddings);
router.route('/winners')
    .get(controller.getMaxAmount);

router.route('/previous')
    .get(controller.getPreviousMaxAmount);

module.exports = router;
