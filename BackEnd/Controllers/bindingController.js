const mongoose = require('mongoose');
require('./../Models/bindingModel');
const bindingSchema = mongoose.model('biddings');
const auctionSchema = mongoose.model('auctions');
const itemDetailsSchema = mongoose.model('itemDetails');
const itemSchema = mongoose.model('items');
const userSchema = mongoose.model('users');

exports.addBidding = async (req, res) => {
  try {

    const { auction_id, item_id, user_id, bide } = req.body;

    // Fetch the item from the database
    const item = await itemSchema.findOne({ _id: item_id });

    if (!item) {
      res.status(400).json({ success: false, error: 'Invalid item ID' });
      return;
    }

    // Check if the bidding amount is greater than or bidding gap of the item
    if (amount < item.bidding_gap) {
      res
        .status(400)
        .json({
          success: false,
          error: 'Bidding amount is less than the bidding gap of the item',
        });
      return;
    }

    // Fetch the user from the database
    const user = await userSchema.findOne({ _id: user_id });

    if (!user) {
      res.status(400).json({ success: false, error: 'Invalid user ID' });
      return;
    }
    //check if user blocked or not
    if (!user.block) {
      res.status(400).json({ success: false, error: 'User is blocked' });
    }

    // Create a new bidding instance
    amount = item.amount + bide;
    const bidding = new bidding({
      auction_id,
      item_id,
      user_id,
      amount,
    });

    // Save the bidding to the database
    await bidding.save();

    res.status(201).json({ success: true, data: bidding });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
