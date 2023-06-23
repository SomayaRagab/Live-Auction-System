const { body } = require('express-validator');
require('./../Models/auctionModel');
const auctionSchema = require('mongoose').model('auctions');

exports.auctionValidatePostArray = [
  body('name').isString().withMessage('Name is required'),
  body('reference_number')
    .isInt()
    .withMessage('Reference Number is required')
    .custom(async (value) => {
      const auction = await auctionSchema.findOne({ reference_number: value });
      if (auction) throw new Error('Reference Number already exist');
    }),
  // validate start date is greater than current date
  body('start_date')
    .isDate()
    .withMessage('start date is required')
    .custom((value) => {
      if (
        new Date(value) < new Date(Date.now()).toISOString().substring(0, 10)
      ) {
        throw new Error('start date must be greater than current date');
      }
      return true;
    }),

  body('time')
    .isString()
    .withMessage('Time must be a time formatted')
    .custom((value) => {
      if (!/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/.test(value)) {
        throw new Error('Value must be time with HH:MM format');
      }
      return true;
    }),
  body('fees').isInt({ min: 1 }).withMessage('Fees is required'),
];

exports.auctionValidatePatchArray = [
  body('name').optional().isString().withMessage('Name must be string'),
  body('start_date')
    .optional()
    .isDate()
    .withMessage('Start Date must be date')
    .custom((value) => {
      if (
        new Date(value.toISOString().substring(0, 10)) <
        new Date(Date.now()).toISOString().substring(0, 10)
      ) {
        throw new Error('start date must be greater than current date');
      }
      return true;
    }),
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
];
