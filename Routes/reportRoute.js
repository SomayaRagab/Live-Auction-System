const express = require('express');
const router = express.Router();
const reportController = require('./../Controllers/reportController');
const validateMW = require('./../Validations/validateMW');
const { checkAdmin } = require('../Middleware/authorization');


router
    .route('/report/user')
    .get(
        // checkAdmin,
        validateMW,
        reportController.getUserReport,
        );

router
    .route('/report/auction')
    .get(
        // checkAdmin,
        validateMW,
        reportController.getAuctionReport,
    );

    // router.get('/report/top-bidding-users',
    // // checkAdmin,
    // validateMW,
    // reportController.getTopBiddingUsers);


router.get('/report/categories',
    // checkAdmin,
    validateMW,
    reportController.getCategoryReport);

router.get('/report/stream', 
    // checkAdmin,
    validateMW,
    reportController.getStreamReport);

router.get('/report/profit', 
    // checkAdmin,
    validateMW,
    reportController.getProfitReport);

module.exports = router;
