const express = require('express');
const controller = require('./../Controllers/auctionsController');
const validateMW = require('./../Validations/validateMW');
const { auctionValidatePostArray, auctionValidatePatchArray } = require('./../Validations/auctionValidateArray');
const validateParamArray  = require('./../Validations/paramValidationArray');
const { checkAdmin , checkUserORAdmin } = require('./../Middleware/authorization');



const router = express.Router();



router.route('/auctions')
    .get(checkUserORAdmin ,controller.getAllAuctions)
    .post(checkAdmin,auctionValidatePostArray , controller.addAuction);

router.route('/auctions/:id')
    .get(checkUserORAdmin ,checkAdmin,validateParamArray,controller.getAuctionById)
    .patch(checkAdmin,validateParamArray, auctionValidatePatchArray, validateMW, controller.updateAuction)
    .delete(checkAdmin,validateParamArray, controller.deleteAuction);


router 
    .route('/auction/:status')
    .get(checkAdmin , controller.getAuctionsByStatus);

router
    .route('/auction/:name')
    .get( checkUserORAdmin,controller.getAuctionsByName)




module.exports = router;