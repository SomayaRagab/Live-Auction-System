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

  body('end_time').isString().withMessage('End Time must be a date')
  .custom((value) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error('Value must be time with HH:MM format');
    }
    return true;
  }),
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

  body('end_time').optional().isString().withMessage('End Time must be a date')
  .custom((value) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error('Value must be time with HH:MM format');
    }
    return true;
  })
  ,


];