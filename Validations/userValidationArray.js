const { body } = require('express-validator');
require('./../Models/userModel');
const userSchema = require('mongoose').model('users');

exports.validatePostArray = [
  body('name')
    .isString()
    .withMessage('اسم المستخدم يجب أن يكون نصا')
    .isLength({ min: 2 })
    .withMessage('اسم المستخدم يجب أن يتكون من حرفين على الأقل'),
  body('email')
    .isEmail()
    .withMessage('البريد الإلكتروني غير صالح')
    .custom(async (value) => {
      const user = await userSchema.findOne({ email: value }, { email: 1 });
      if (user) throw new Error('البريد الإلكتروني موجود بالفعل');
    }),
  body('password')
    .isStrongPassword()
    .withMessage(
      'الرقم السري يجب أن يكون على الأقل 8 أحرف ويحتوي على حرف كبير وحرف صغير ورقم ورمز خاص'
    ),
  body('city').isString().withMessage('المدينة يجب أن تكون نصا'),
  body('street').isString().withMessage('الشارع يجب أن يكون نصا'),
  body('building').isString().withMessage('المبنى يجب أن يكون نصا'),
  body('phone')
    .isString()
    .withMessage('رقم الهاتف يجب أن يكون نصا')
    .isLength({ min: 11, max: 11 })
    .withMessage('رقم الهاتف يجب أن يكون 11 رقما')
    .matches(/^01[0125][0-9]{8}$/)
    .withMessage('رقم الهاتف غير صالح'),
];

exports.validatePatchArray = [
  body('name')
    .optional()
    .isString()
    .withMessage('اسم المستخدم غير صالح ')
    .isLength({ min: 2 })
    .withMessage('اسم المستخدم يجب أن يتكون من حرفين على الأقل'),
  body('city').optional().isString().withMessage('المدينة يجب أن تكون نصا'),
  body('street').optional().isString().withMessage('الشارع يجب أن يكون نصا'),
  body('building').optional().isString().withMessage('المبنى يجب أن يكون نصا'),
  body('phone')
    .optional()
    .isString()
    .withMessage('رقم الهاتف يجب أن يكون نصا')
    .isLength({ min: 11, max: 11 })
    .withMessage('')
    .matches(/^01[0125][0-9]{8}$/)
    .withMessage('invalid phone number'),
];
