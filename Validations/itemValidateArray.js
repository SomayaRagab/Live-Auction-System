const { body } = require('express-validator');

exports.itemValidatePostArray = [
  body('name').isString().withMessage('يجب أن يكون الاسم نصًا'),

  body('qty')
    .isInt({ min: 1 })
    .withMessage('يجب أن يكون الكمية عددًا أكبر من 0'),

  body('material').isString().withMessage('يجب أن يكون المادة الخام نصًا'),

  body('size').isString().withMessage('يجب أن يكون الحجم نصًا'),

  body('color').isString().withMessage('يجب أن يكون اللون نصًا'),

  body('category')
    .isInt({ min: 1 })
    .withMessage('يجب أن تكون الفئة رقمًا'),

];

exports.itemValidatePatchArray = [
  body('name').optional().isString().withMessage('يجب أن يكون الاسم نصًا'),

  body('qty')
    .optional()
    .isInt({ min: 1 })
    .withMessage('يجب أن يكون الكمية عددًا أكبر من 0'),

  body('material')
    .optional()
    .isString()
    .withMessage('يجب أن يكون المادة الخام نصًا'),

  body('size').optional().isString().withMessage('يجب أن يكون الحجم نصًا'),

  body('color').optional().isString().withMessage('يجب أن يكون اللون نصًا'),

  body('category')
    .optional()
    .isInt({ min: 1 })
    .withMessage('يجب أن تكون الفئة رقمًا'),
];
