const express = require('express');
const controller = require('./../Controllers/auctionsController');
const validateMW = require('./../Validations/validateMW');

const router = express.Router();

router
    .route('/auctions')
    .get( controller.getAllAuctions)
    .post(controller.addAuction)
    

router
    .route('/auctions/:id')
    .get(controller.getAuctionById)
    .put(controller.updateAuction)
    .delete(controller.deleteAuction);


router 
    .route('/auctions/:status')
    .get(controller.getAuctionsByStatus);

router
    .route('/auctions/:name')
    .get(controller.getAuctionsByName)


module.exports = router;