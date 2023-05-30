const { body } = require('express-validator');
exports.auctionValidatePostArray = [
  body('name').isString().withMessage('Name is required'),
  body('reference_number').isInt().withMessage('Reference Number is required'),
  body('start_date').isDate().withMessage('Start Date is required'),
  body('end_date').isDate().withMessage('End Date is required'),
  body('time')
    .isString()
    .withMessage('Time must be a time formatted')
    .custom((value) => {
      if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
        throw new Error('Value must be time with HH:MM format');
      }
      return true;
    }),
  body('fees').isInt({ min: 1 }).withMessage('Fees is required'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Items must be an array of at least 1 number'),

  body('items.*').isInt({ min: 1 }).withMessage('Item must be number'),
];

exports.auctionValidatePatchArray = [
  body('name').optional().isString().withMessage('Name must be string'),
  body('reference_number')
    .optional()
    .isInt()
    .withMessage('Reference Number must be number'),
  body('start_date').optional().isDate().withMessage('Start Date must be date'),
  body('end_date').optional().isDate().withMessage('End Date must be date'),
  body('time')
    .optional()
    .isString()
    .withMessage('Time must be formatted')
    .custom((value) => {
      if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
        throw new Error('Value must be time with HH:MM format');
      }
      return true;
    }),
  body('fees').optional().isInt({ min: 1 }).withMessage('Fees is required'),
  body('items')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Items must be an array of at least 1 number'),

  body('items.*').isInt({ min: 1 }).withMessage('Item must be number'),
];
