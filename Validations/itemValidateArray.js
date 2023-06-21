const { body } = require('express-validator');

exports.itemValidatePostArray = [
  body('name').isString().withMessage('Name must be a string'),

  body('qty')
    .isInt({ min: 1 })
    .withMessage('Qty must be a number greater than 0'),

  body('material').isString().withMessage('Material must be a string'),

  body('size').isString().withMessage('Size must be a string'),

  body('color').isString().withMessage('Color must be a string'),

  body('category')
    .isInt({ min: 1 })
    .withMessage('Category must be number'),

];

exports.itemValidatePatchArray = [
  body('name').optional().isString().withMessage('Name must be a string'),

  body('qty')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Qty must be a number greater than 0'),

  body('material')
    .optional()
    .isString()
    .withMessage('Material must be a string'),

  body('size').optional().isString().withMessage('Size must be a string'),

  body('color').optional().isString().withMessage('Color must be a string'),

  body('category')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category must be number'),
];
