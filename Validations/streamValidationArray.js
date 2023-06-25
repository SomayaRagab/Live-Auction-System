const { body } = require('express-validator');

exports.streamValidatePostArray = [
    body('title').isString().withMessage('Name is required'),
    body('description').isString().withMessage('Description is required'),
    body('link').isString().withMessage('Link is required'),
];
