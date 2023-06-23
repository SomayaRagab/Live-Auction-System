const exprees = require('express');
const validateParamArray = require('./../Validations/paramValidationArray');
const validateMW = require('./../Validations/validateMW');
const constroller = require('./../Controllers/joinAuctionController');

const router = exprees.Router();

router
  .route('/joinAuction')
  .get(constroller.getJoinedAuctions)
  .post(constroller.joinAuction);

// check if user already joined the auction
router
  .route('/checkJoinAuction/:id')
  .get(validateParamArray, validateMW, constroller.checkIfUserJoinedAuction);

module.exports = router;
