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

module.exports = router;