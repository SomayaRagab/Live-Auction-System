const express = require('express');
const router = express.Router();
const controller = require('../Controllers/cardController');

router.route('/winners').get(controller.getAllWinner);
router.route('/winners/items').get(controller.getWinnerItems);

router
  .route('/cards/:id')
  .delete(controller.deleteCard);
  
router.get('/getPayedItems' , controller.getPayedItems);

router.get('/getNotPayedItems' , controller.getNotPayedItems);

module.exports = router;
