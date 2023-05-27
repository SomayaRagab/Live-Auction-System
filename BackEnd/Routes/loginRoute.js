const express = require("express");
const router = express.Router();
const loginController = require("./../Controllers/loginController").login;

router.post("/login", loginController);

module.exports = router;