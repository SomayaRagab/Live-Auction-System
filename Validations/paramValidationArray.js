const { param } = require('express-validator');

module.exports = validateParamArray = [
  param('id').isInt().withMessage('يجب أن يكون المعرف رقمًا'),
];
