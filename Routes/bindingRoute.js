const controller = require('../Controllers/bindingController');
const express = require('express');
const router = express.Router();
const { biddingValidatePostArray, biddingValidatePatchArray } = require('../Validations/biddingValidationArray');
const validateMW = require('./../Validations/validateMW');


router.route('/biddings')
    .post(biddingValidatePostArray, validateMW, controller.addBidding);

router.route('/biddings')
     .get(controller.getAllBiddings);
router.route('/winner/:itemDetails_id')
    .get(controller.getWinner);

router.route('/previous')
    .get(controller.getPreviousMaxAmount);

router.route('/bidding/:id')
.delete(controller.deleteBidding);

module.exports = router;
