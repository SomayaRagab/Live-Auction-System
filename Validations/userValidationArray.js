const { body } = require('express-validator');
require('./../Models/userModel');
const userSchema = require('mongoose').model('users');

exports.validatePostArray = [
  body('name')
    .isString()
    .withMessage('name must be string')
    .isLength({ min: 2 })
    .withMessage('name must be at least 2 chars'),
  body('email').isEmail().withMessage('invalid email')
    .custom(async (value) => {
      const user = await userSchema.findOne({ email: value }, {email:1});
      if (user) throw new Error('email already exist');
    })
  ,
  body('password')
    .isStrongPassword()
    .withMessage(
      'password must be at least 8 chars, one uppercase letter, one lowercase letter,one special char, and one number'
    ),
  body('city').isString().withMessage('city must be string'),
  body('street').isString().withMessage('street must be string'),
  body('building').isString().withMessage('building must be string'),
  body('phone')
    .isString()
    .withMessage('phone must be string')
    .isLength({ min: 11, max: 11 })
    .withMessage('phone must be  11 chars')
    .matches(/^01[0125][0-9]{8}$/)
    .withMessage('invalid phone number'),
];

exports.validatePatchArray = [
  body('name')
    .optional()
    .isString()
    .withMessage('name must be string')
    .isLength({ min: 2 })
    .withMessage('name must be at least 2 chars'),
  body('email').optional().isEmail().withMessage('invalid email')
    .custom(async (value) => {
      const user = await userSchema.findOne({ email: value } , {email:1});
      if (user) throw new Error('email already exist');
      }),
  body('password')
    .optional()
    .isStrongPassword()
    .withMessage(
      'password must be at least 8 chars, one uppercase letter, one lowercase letter,one special char, and one number'
    ),
  body('city').optional().isString().withMessage('city must be string'),
  body('street').optional().isString().withMessage('street must be string'),
  body('building').optional().isString().withMessage('building must be string'),
  body('phone')
    .optional()
    .isString()
    .withMessage('phone must be string')
    .isLength({ min: 11, max: 11 })
    .withMessage('phone must be  11 chars')
    .matches(/^01[0125][0-9]{8}$/)
    .withMessage('invalid phone number'),
];