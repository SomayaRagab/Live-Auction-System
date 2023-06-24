const express = require('express');
const controller = require('./../Controllers/streamController');
const validateMW = require('./../Validations/validateMW');
const { streamValidatePostArray } = require('./../Validations/streamValidationArray');
const validateParamArray  = require('./../Validations/paramValidationArray');
const { checkAdmin , checkUserORAdmin } = require('./../Middleware/authorization');

const router = express.Router();

router.route('/streams')
    .get(checkUserORAdmin ,controller.getAllStreams)
    .post(checkAdmin,streamValidatePostArray ,controller.addStream);

router.route('/streams/:id')
    .get(checkUserORAdmin ,checkAdmin,validateParamArray,controller.getStreamById)
    .delete(checkAdmin,validateParamArray, controller.deleteStream);

router.route('/streamstatus/:id')
.get(checkAdmin,validateParamArray,controller.changeStreamStatus);


module.exports = router;
