const express = require('express');
const router = express.Router();
const controller = require('../Controllers/cardController');

router.route('/winners').get(controller.getAllWinner);
router.route('/winners/items').get(controller.getWinnerItems);

router
  .route('/cards/:id')
  // .get(controller.getAllItemDetails)
  .delete(controller.deleteCard);

module.exports = router;
