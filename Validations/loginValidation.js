const { body } = require("express-validator");

exports.login = [
    body("email").isEmail().withMessage("بريد إلكتروني غير صالح"),
    body("password").isLength({ min: 8 }).withMessage("كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
];


