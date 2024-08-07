const exprees = require('express');
const validateParamArray = require('./../Validations/paramValidationArray');
const validateMW = require('./../Validations/validateMW');
const constroller = require('./../Controllers/joinAuctionController');

const router = exprees.Router();

router
  .route('/joinAuction')
  .get(constroller.getJoinedAuctions)
  .post(constroller.joinAuction);

router
  .route('/allJoinActions')
  .get(constroller.getAllJoinAuctions)



module.exports = router;
