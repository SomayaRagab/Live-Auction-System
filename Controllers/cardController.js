const mongoose = require('mongoose');
require('./../Models/cardModel');
const cardSchema = mongoose.model('cards');

// get all winner to the database

exports.getAllWinner = async (req, res) => {
  try {
    const allWinner = await cardSchema
      .find()
      .populate({ path: 'user_id', select: { name: 1, email: 1 } })
      .populate({ path: 'itemDetails_id', select: { name: 1 } });
    res.status(200).json({ data: allWinner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get all itemDetails for logged in user IN cardSchema

exports.getAllItemDetails = async (req, res, next) => {
  try {
    const allItemDetails = await cardSchema
      .find({ user_id: req.id })
      .populate({ path: 'itemDetails_id', select: { duration:1 , item_id:1 } });
    // .populate('itemDetails_id');
    res.status(200).json({ data: allItemDetails });
  } catch (err) {
    next(err);
  }
};
