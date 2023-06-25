const {body} =require('express-validator');
exports.biddingValidatePostArray=[
    body('itemDetails_id').isInt().withMessage('معرف تفاصيل المنتج يجب أن يكون رقمًا'),
    body('bide').isInt().withMessage('مبلغ المزايدة يجب أن تكون رقمًا'),
];

exports.biddingValidatePatchArray=[
    body('itemDetails_id').optional().isInt().withMessage('معرف تفاصيل المنتج يجب أن يكون رقمًا'),
];