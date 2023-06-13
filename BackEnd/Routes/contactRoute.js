const express = require('express');
const router = express.Router();
const contactController = require('./../Controllers/contactController');
const validateMW = require('./../Validations/validateMW');
const contactValidation = require('./../Validations/contactValidation').contactValidation;
const { checkAdmin, checkUserORAdmin } = require('../Middleware/authorization');


router.route('/contact').post(contactValidation, validateMW, contactController.addContact);

module.exports = router; 
