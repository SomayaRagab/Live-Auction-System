const { body } = require('express-validator');

exports.resetValidatePostArray = [
  body('email').isEmail().withMessage('بريد إلكتروني غير صالح'),
];

exports.resetValidatePatchArray = [
  body('password')
    .isStrongPassword()
    .withMessage(
      'الرقم السري يجب أن يكون على الأقل 8 أحرف ويحتوي على حرف كبير وحرف صغير ورقم ورمز خاص'
    ),
  body('confirmPassword')
  .isStrongPassword()
  .withMessage( 'الرقم السري يجب أن يكون على الأقل 8 أحرف ويحتوي على حرف كبير وحرف صغير ورقم ورمز خاص')
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('كلمة المرور غير متطابقة');
    }
    return true;
  }),
];

// validate code
exports.validateCode = [
  body('numberOne')
    .isString()
    .withMessage('الرمز يجب أن يكون رقمًا')
    .isLength({ min: 1, max: 1 })
    .withMessage('الرمز يجب أن يكون رقمًا واحدًا'),

  body('numberTwo')
    .isString()
    .withMessage('الرمز يجب أن يكون رقمًا')
    .isLength({ min: 1, max: 1 })
    .withMessage('الرمز يجب أن يكون رقمًا واحدًا '),

  body('numberThree')
    .isString()
    .withMessage('الرمز يجب أن يكون رقمً')
    .isLength({ min: 1, max: 1 })
    .withMessage('لرمز يجب أن يكون رقمًا واحدًا '),

  body('numberFour')
    .isString()
    .withMessage('الرمز يجب أن يكون رقمً')
    .isLength({ min: 1, max: 1 })
    .withMessage('لرمز يجب أن يكون رقمًا واحدًا'),

  body('numberFive')
    .isString()
    .withMessage('الرمز يجب أن يكون رقمً')
    .isLength({ min: 1, max: 1 })
    .withMessage('لرمز يجب أن يكون رقمًا واحدًا'),



];
