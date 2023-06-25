const { body } = require('express-validator');
require('./../Models/auctionModel');
const auctionSchema = require('mongoose').model('auctions');

exports.auctionValidatePostArray = [
  body('name').isString().withMessage('الاسم مطلوب'),
  body('reference_number')
    .isInt()
    .withMessage('رقم المرجع مطلوب')
    .custom(async (value) => {
      const auction = await auctionSchema.findOne({ reference_number: value });
      if (auction) throw new Error('رقم المرجع موجود بالفعل');
    }),
  // validate start date is greater than current date
  body('start_date')
    .isDate()
    .withMessage('تاريخ البدء مطلوب')
    .custom((value) => {
      if (
        new Date(value) < new Date(Date.now()).toISOString().substring(0, 10)
      ) {
        throw new Error('تاريخ البدء يجب أن يكون أكبر من التاريخ الحالي');
      }
      return true;
    }),

  body('time')
    .isString()
    .withMessage('الوقت يجب أن يكون بتنسيق الوقت')
    .custom((value) => {
      if (!/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/.test(value)) {
        throw new Error('القيمة يجب أن تكون وقت بتنسيق ساعة:دقيقة');
      }
      return true;
    }),
  body('fees').isInt({ min: 0 }).withMessage('تامين يحب ان يكون  صفر او اكبر '),
];

exports.auctionValidatePatchArray = [
  body('name').optional().isString().withMessage('الاسم يجب أن يكون نصيًا'),
  body('start_date')
    .optional()
    .isDate()
    .withMessage('تاريخ البدء يجب أن يكون تاريخًا')
    .custom((value) => {
      if (
        new Date(value) <
        new Date(Date.now()).toISOString().substring(0, 10)
      ) {
        throw new Error('تاريخ البدء يجب أن يكون أكبر من التاريخ الحالي');
      }
      return true;
    }),
  body('time')
    .optional()
    .isString()
    .withMessage('الوقت يجب أن يكون بتنسيق الوقت')
    .custom((value) => {
      if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
        throw new Error('القيمة يجب أن تكون وقت بتنسيق ساعة:دقيقة');
      }
      return true;
    }),
 
    body('fees').optional().isInt({ min: 0 }).withMessage('تامين يحب ان يكون  صفر او اكبر '),
  ];
  

