const {body} =require('express-validator');
exports.biddingValidatePostArray=[
    body('itemDetails_id').isInt().withMessage('Item Details ID must be number'),
    body('bide').isInt().withMessage('Bide must be number'),
];

exports.biddingValidatePatchArray=[
    body('itemDetails_id').optional().isInt().withMessage('Item Details ID must be number'),
];