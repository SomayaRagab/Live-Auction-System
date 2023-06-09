const exprees = require('express');
const controller = require('../Controllers/categoryController');
const validateMW = require('../Validations/validateMW');
const validateParamArray = require('../Validations/paramValidationArray');
const {validatePostArray , validatePatchArray} = require('../Validations/catecoryValidateArray');
const {checkAdmin , checkUserORAdmin} = require('../Middleware/authorization');


const router = exprees.Router();

router.route('/categories')
    .get(checkUserORAdmin ,controller.getAllCategories)
    .post( checkAdmin,validatePostArray, validateMW, controller.addCategory);


router.route('/categories/:id')
    .get(checkUserORAdmin ,validateParamArray , controller.getCategory)
    .patch(checkAdmin ,validateParamArray, validatePatchArray,  controller.updateCategory)
    .delete(checkAdmin,validateParamArray,  controller.deleteCategory);


module.exports = router;    

