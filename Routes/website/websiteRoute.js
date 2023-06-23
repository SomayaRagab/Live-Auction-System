const express = require('express');
const validateParamArray = require('./../../Validations/paramValidationArray');
const contactValidation = require('./../../Validations/contactValidation').contactValidation;
const validateMW = require('./../../Validations/validateMW');
const {getAllAuctions ,getAuctionById,newArrivalAuction,getAuctionsByStatus} =require('./../../Controllers/auctionsController');
const{getItemDetailsByAuctionId,getItemDetailsById , getItemDetails} =require('./../../Controllers/itemDetailsController');
const{newArrival ,getAllItems ,getItem} =require('./../../Controllers/itemsController');
const {addContact} = require('./../../Controllers/contactController');



const router = express.Router();   

// route auctions
router.get('/website/auctions',getAllAuctions)
router.get('/website/auctions/:id',validateParamArray,validateMW, getAuctionById)
router.get('/website/newArrivalAuction',newArrivalAuction)
router.get('/website/auction/:status',getAuctionsByStatus)


// route itemDetails
router.get('/website/itemDetails',getItemDetails)
router.get('/website/itemDetails/:id',validateParamArray,validateMW,getItemDetailsById)
router.get('/website/auction/:id/items',validateParamArray,validateMW,getItemDetailsByAuctionId)


// route items
router.get('/website/items',getAllItems)
router.get('/website/items/:id',validateParamArray,validateMW,getItem)
router.get('/website/newArrivalItem', newArrival);

// contact us
router.post(contactValidation, validateMW, addContact)

module.exports = router;



