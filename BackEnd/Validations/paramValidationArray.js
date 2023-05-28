const { param } = require("express-validator");

module.exports = validateParamArray = [
  param("id").isInt().withMessage("id param should be integer"),
];

