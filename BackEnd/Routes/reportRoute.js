const express = require('express');
const router = express.Router();
const reportController = require('./../Controllers/reportController');
const validateMW = require('./../Validations/validateMW');
const { checkAdmin } = require('../Middleware/authorization');


router
    .route('/report')
    .get(
        // checkAdmin,
        validateMW,
        reportController.getReport,
        );

module.exports = router;