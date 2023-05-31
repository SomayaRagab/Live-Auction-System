const express = require("express");
const router = express.Router();
const loginController = require("./../Controllers/loginController").login;
const validateMW = require('./../Validations/validateMW');
const loginValidation = require("./../Validations/loginValidation");
// const authentication = require("../Middleware/authentication");

router.post("/login",loginValidation.login, validateMW, loginController);

module.exports = router;