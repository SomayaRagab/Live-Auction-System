const { body } = require("express-validator");

exports.contactValidation = [
    body("name").isString().withMessage('Name must be a string'),
    body("email").isEmail().withMessage("Email Invalid"),
    body("phone").isString().withMessage("phone Invalid"),
    body("subject").isString().withMessage("subject Invalid"),
    body("message").isString().withMessage("subject Invalid"),

];


