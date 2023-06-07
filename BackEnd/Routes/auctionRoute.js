const express = require('express');
const controller = require('./../Controllers/auctionsController');
const validateMW = require('./../Validations/validateMW');
const { auctionValidatePostArray, auctionValidatePatchArray } = require('./../Validations/auctionValidateArray');
const validateParamArray  = require('./../Validations/paramValidationArray');

const router = express.Router();

router.route('/auctions')
    .get(controller.getAllAuctions)
    .post(auctionValidatePostArray , controller.addAuction);

router.route('/auctions/:id')
    .get(validateParamArray,controller.getAuctionById)
    .patch(validateParamArray, auctionValidatePatchArray, validateMW, controller.updateAuction)
    .delete(validateParamArray, controller.deleteAuction);




router 
    .route('/auctions/:status')
    .get(controller.getAuctionsByStatus);

router
    .route('/auctions/:name')
    .get(controller.getAuctionsByName)


module.exports = router;