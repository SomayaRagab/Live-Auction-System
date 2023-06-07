const express = require('express');
const router = express.Router();
const loginController = require('./../Controllers/loginController').login;
const validateMW = require('./../Validations/validateMW');
const loginValidation = require('./../Validations/loginValidation').login;

router.route('/login').post(loginValidation, loginController);
module.exports = router;
