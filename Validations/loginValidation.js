const { body } = require("express-validator");

exports.login = [
    body("email").isEmail().withMessage("Email Invalid"),
    body("password").isLength({ min: 8 }).withMessage("Password Short"),
];


