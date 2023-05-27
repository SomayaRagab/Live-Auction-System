const { body } = require('express-validator');

exports.validatePostArray = [

  body('name')
    .isString()
    .withMessage('name must be string')
    .isLength({ min: 2 })
    .withMessage('name must be at least 2 chars'),

  body('email').isEmail().withMessage('invalid email'),

  body('password')
    .isStrongPassword()
    .withMessage(
      'password must be at least 8 chars, one uppercase letter, one lowercase letter,one special char, and one number'
    ),
  body('image').isString().withMessage('image must be string'),
  body('city').isString().withMessage('city must be string'),
  body('street').isString().withMessage('street must be string'),
  body('building').isString().withMessage('building must be string'),
  body('role').isString().withMessage('role must be string'),
  body('phone')
    .isString()
    .withMessage('phone must be string')
    .isLength({ min: 11, max: 11 })
    .withMessage('phone must be  11 chars')
    .matches(/^01[0125][0-9]{8}$/)
    .withMessage('invalid phone number'),
];
