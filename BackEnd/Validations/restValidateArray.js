const { body } = require('express-validator');

exports.resetValidatePostArray = [
  body('email').isEmail().withMessage('Please enter a valid email'),
];

exports.resetValidatePatchArray = [
  body('password')
    .isStrongPassword()
    .withMessage(
      'password must be at least 8 chars, one uppercase letter, one lowercase letter,one special char, and one number'
    ),
  body('confirmPassword')
  .isStrongPassword()
  .withMessage( 'password must be at least 8 chars, one uppercase letter, one lowercase letter,one special char, and one number')
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
];

// validate code
exports.validateCode = [
  body('numberOne')
    .isString()
    .withMessage('code must be a number')
    .isLength({ min: 1, max: 1 })
    .withMessage('code must be one digit '),

  body('numberTwo')
    .isString()
    .withMessage('code must be a number')
    .isLength({ min: 1, max: 1 })
    .withMessage('code must be one digit '),

  body('numberThree')
    .isString()
    .withMessage('code must be a number')
    .isLength({ min: 1, max: 1 })
    .withMessage('code must be one digit '),

  body('numberFour')
    .isString()
    .withMessage('code must be a number')
    .isLength({ min: 1, max: 1 })
    .withMessage('code must be one digit'),

  body('numberFive')
    .isString()
    .withMessage('code must be a number')
    .isLength({ min: 1, max: 1 })
    .withMessage('code must be one digit'),



];
