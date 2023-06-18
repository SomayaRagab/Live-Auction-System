const { body } = require('express-validator');
require('./../Models/categoryModel');
const categorySchema = require('mongoose').model('categories');

exports.validatePostArray = [
  body('name')
    .isString()
    .withMessage('name must be string')
    .isLength({ min: 2 })
    .withMessage('name must be at least 2 chars')
    .custom(async (value) => {
      const category = await categorySchema.findOne({ name: value }, { name: 1 });
      if (category) throw new Error('category  already exist');
    }),
];

exports.validatePatchArray = [
  body('name')
    .optional()
    .isString()
    .withMessage('name must be string')
    .isLength({ min: 2 })
    .withMessage('name must be at least 2 chars')
    .custom(async (value) => {
      const category = await categorySchema.findOne({ name: value }, { name: 1 });
      if (category) throw new Error('category  already exist');
    })
    ,
];
