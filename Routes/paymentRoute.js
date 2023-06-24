const express = require('express');
const controller = require('./../Controllers/paymentController');
const { route } = require('./joinAuctionRoute');



const router = express.Router();

router.post('/checkout-session/:id' , controller.createCheckoutSession);

router.get('/checkPayment/:id' , controller.checkPayment);






module.exports = router;