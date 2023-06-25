const { body } = require('express-validator');

exports.itemDetailsValidatePostArray = [
  body('bidding_gap')
    .isInt({ min: 1 })
    .withMessage('يجب أن يكون مبلغ المزايدة عددًا أكبر من 0'),

  body('start_bidding')
    .isInt({ min: 1 })
    .withMessage('يجب أن يكون بداية المزايدة عددًا أكبر من 0'),

  body('max_price')
    .isInt({ min: 1 })
    .withMessage('يجب أن يكون السعر الأقصى عددًا أكبر من  0'),

  body('duration').isInt().withMessage('يجب أن تكون المدة بالدقائق '),
  body('item_id')
    .isInt({ min: 1 })
    .withMessage('يجب أن يكون معرف المنتج عددًا أكبر من 0'),

  body('start_date').isDate().withMessage('يجب أن تكون تاريخ البدء تاريخًا'),

  body('start_time')
    .isString()
    .withMessage('يجب أن يكون وقت البدء بتنسيق صحيح')
    .custom((value) => {
      if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
        throw new Error('يجب أن يكون القيمة وقتًا بتنسيق ساعة:دقيقة');
      }
      return true;
    }),
];

exports.itemDetailsValidatePatchArray = [
  body('bidding_gap')
    .optional()
    .isInt({ min: 1 })
    .withMessage('يجب أن يكون مبلغ المزايدة عددًا أكبر من 0'),

  body('start_bidding')
    .optional()
    .isInt({ min: 1 })
    .withMessage('يجب أن يكون بداية المزايدة عددًا أكبر من 0'),

  body('max_price')
    .optional()
    .isInt({ min: 1 })
    .withMessage('يجب أن يكون السعر الأقصى عددًا أكبر من 0'),

  body('item_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('يجب أن يكون معرف المنتج عددًا أكبر من 0'),

  body('auction_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('يجب أن يكون معرف المزاد عددًا أكبر من 0'),

  body('duration')
    .optional()
    .isInt()
    .withMessage('يجب أن تكون المدة عددًا أكبر من 0'),

  body('start_date')
    .optional()
    .isDate()
    .withMessage('يجب أن يكون تاريخ البدء تاريخًا'),

  body('start_time')
    .optional()
    .isString()
    .withMessage('يجب أن يكون وقت البدء بتنسيق صحيح')
    .custom((value) => {
      if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
        throw new Error('يجب أن يكون القيمة وقتًا بتنسيق ساعة:دقيقة');
      }
      return true;
    }),
];
