const exprees = require('express');
const controller = require('../Controllers/categoryController');
const validateMW = require('../Validations/validateMW');
const validateParamArray = require('../Validations/paramValidationArray');
const {validatePostArray , validatePatchArray} = require('../Validations/catecoryValidateArray');


const router = exprees.Router();

router.route('/categories')
    .get(controller.getAllCategories)
    .post(validatePostArray, validateMW, controller.addCategory);


router.route('/categories/:id')
    .get(validateParamArray, validateMW, controller.getCategory)
    .patch(validateParamArray, validatePatchArray, validateMW, controller.updateCategory)
    .delete(validateParamArray, validateMW, controller.deleteCategory);


module.exports = router;    

