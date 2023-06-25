const express = require('express');
const controller = require('./../Controllers/paymentController');
const bodyParser = require('body-parser');

const router = express.Router();

router.post('/checkout-session/:id', controller.createCheckoutSession);

router.patch('/checkPayment/:status/:id', controller.checkPayment);

module.exports = router;
