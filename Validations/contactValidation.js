const { body } = require("express-validator");

exports.contactValidation = [
    body("name").isString().withMessage('يجب أن يكون الاسم نصًا'),
    body("email").isEmail().withMessage("البريد الإلكتروني غير صالح"),
    body("phone").isString().withMessage("رقم الهاتف غير صالح"),
    body("subject").isString().withMessage("الموضوع غير صالح"),
    body("message").isString().withMessage("الرسالة غير صالحة"),

];


