const express = require('express');
const controller = require('./../Controllers/resetPasswordController');
const validateMW = require('./../Validations/validateMW');
const {
 resetValidatePostArray,
 resetValidatePatchArray,
 validateCode,
} = require('./../Validations/restValidateArray');
const router = express.Router();

router.post('/reset-password',resetValidatePostArray,validateMW, controller.sendResetPasswordEmail);
router.post('/reset-password/:token/:code', validateCode , validateMW,controller.verifyResetPasswordToken);
router.patch('/reset-password/:token', resetValidatePatchArray, validateMW ,controller.updatePassword);

module.exports = router;


