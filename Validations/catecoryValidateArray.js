const { body } = require('express-validator');
require('./../Models/categoryModel');
const categorySchema = require('mongoose').model('categories');

exports.validatePostArray = [
  body('name')
    .isString()
    .withMessage('اسم الفئة يجب أن يكون نص')
    .isLength({ min: 2 })
    .withMessage('يجب أن يحتوي اسم الفئة على ما لا يقل عن 2 أحرف')
    .custom(async (value) => {
      const category = await categorySchema.findOne({ name: value }, { name: 1 });
      if (category) throw new Error('الفئة موجودة بالفعل');
    }),
];

exports.validatePatchArray = [
  body('name')
    .optional()
    .isString()
    .withMessage('اسم الفئة يجب أن يكون نص')
    .isLength({ min: 2 })
    .withMessage('يجب أن يحتوي اسم الفئة على ما لا يقل عن 2 أحرف')
    .custom(async (value) => {
      const category = await categorySchema.findOne({ name: value }, { name: 1 });
      if (category) throw new Error('الفئة موجودة بالفعل');
    })
    ,
];
