const {body} =require('express-validator');
exports.biddingValidatePostArray=[
    body('auction_id').isInt().withMessage('Auction ID must be number'),
    body('item_id').isInt().withMessage('Item ID must be number'),
    body('user_id').isInt().withMessage('User ID must be number'),
    body('bide').isInt().withMessage('Bide must be number'),
];

exports.biddingValidatePatchArray=[
    body('auction_id').optional().isInt().withMessage('Auction ID must be number'),
    body('item_id').optional().isInt().withMessage('Item ID must be number'),
    body('user_id').optional().isInt().withMessage('User ID must be number'),
];