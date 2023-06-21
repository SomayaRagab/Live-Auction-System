const express = require('express');
const router = express.Router();
const controller = require('../Controllers/cardController');

router.route('/winners')
    .get(controller.getAllWinner);



module.exports = router;
