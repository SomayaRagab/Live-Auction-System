const { body } = require('express-validator');

exports.itemDetailsValidatePostArray = [
  body('bidding_gap')
    .isInt({ min: 1 })
    .withMessage('Bidding Gap must be a number greater than 0'),

  body('start_bidding')
    .isInt({ min: 1 })
    .withMessage('Start Bidding must be a number greater than 0'),

  body('max_price')
    .isInt({ min: 1 })
    .withMessage('Max Price must be a number greater than 0'),

  body('item_id')
    .isInt({ min: 1 })
    .withMessage('Item Id must be a number greater than 0'),

  body('end_time').isDate().withMessage('End Time must be a date'),
];

exports.itemDetailsValidatePatchArray = [
  body('bidding_gap')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Bidding Gap must be a number greater than 0'),

  body('start_bidding')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Start Bidding must be a number greater than 0'),

  body('max_price')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max Price must be a number greater than 0'),

  body('item_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Item Id must be a number greater than 0'),

  body('end_time').optional().isDate().withMessage('End Time must be a date'),
];
