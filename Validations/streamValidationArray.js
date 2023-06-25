const { body } = require('express-validator');

exports.streamValidatePostArray = [
    body('title').isString().withMessage('الاسم مطلوب'),
    body('description').isString().withMessage('الوصف مطلوب'),
    body('link').isString().withMessage('الرابط مطلوب'),
];
