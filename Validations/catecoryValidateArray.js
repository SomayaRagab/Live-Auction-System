const { body } = require('express-validator');

exports.validatePostArray = [
  body('name')
    .isString()
    .withMessage('name must be string')
    .isLength({ min: 2 })
    .withMessage('name must be at least 2 chars'),
];

exports.validatePatchArray = [
  body('name')
    .optional()
    .isString()
    .withMessage('name must be string')
    .isLength({ min: 2 })
    .withMessage('name must be at least 2 chars'),
];
