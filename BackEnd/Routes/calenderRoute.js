const express = require('express');
const router = express.Router();
const calendarController = require('./../Controllers/calendarController');
const validateMW = require('./../Validations/validateMW');
const { checkAdmin } = require('../Middleware/authorization');


router
    .route('/calendar/:year/:month')
    .get(
        checkAdmin,
        validateMW,
        calendarController.getCalendar);

module.exports = router;
