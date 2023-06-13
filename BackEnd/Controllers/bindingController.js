const mongoose = require('mongoose');
require('./../Models/bindingModel');
require('./../Models/itemDetailsModel');
const bindingSchema = mongoose.model('biddings');
const itemDetailsSchema = mongoose.model('itemDetails');
const userSchema = mongoose.model('users');

exports.addBidding = async (req, res) => {
  try {
    const { auction_id, item_id, bide , user_id } = req.body;
    let amount = req.body.amount || 0;
    // const user_id = req.id;

    // Fetch the item from the database
    const itemDetails = await itemDetailsSchema.findOne({
      item_id: item_id,
      auction_id: auction_id,
    });

    if (!itemDetails) {
      res.status(400).json({ success: false, error: 'Invalid item ID' });
      return;
    }
    // Fetch the user from the database
    const user = await userSchema.findOne({ _id: user_id });

    if (!user || user.block) {
      res.status(400).json({ success: false, error: 'Invalid user' });
      return;
    }

    // Check if the bidding amount is greater than or bidding gap of the item
    if (bide < itemDetails.bidding_gap) {
      console.log('bide', bide);
      console.log('itemDetails.bidding_gap', itemDetails.bidding_gap);
      res.status(400).json({
        success: false,
        error: 'Bidding amount is less than the bidding gap of the item',
      });
      return;
    }

    // Create a new bidding instance
    // amount is current value details + bide
    // find max amount to be added to bide
    // last_price = await bindingSchema.find({ auction_id: auction_id, item_id: item_id }).then((data) => {
    //   console.log(data);
    //   return data.amount;
    // });
    // amount=last_price+bide;
    amount += itemDetails.current_price + bide;
    
    await itemDetailsSchema.updateOne(
      { item_id: item_id, auction_id: auction_id },
      { current_price: amount }
    );


    if (amount > itemDetails.max_price) {
      res.status(400).json({
        success: false,
        error: 'Bidding amount is greater than the max price of the item',
      });
      return;
    }

    const bidding = new bindingSchema ({
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


// get all biddings

exports.getAllBiddings = (request, response, next) => {
  bindingSchema
    .find({})
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
}

//function to get the max amount for item in auction
exports.getMaxAmount = async (request, response, next) => {
  try {
    const { auction_id, item_id } = request.body;
    const max_amount = await bindingSchema
      .find({ auction_id: auction_id, item_id: item_id })
      .sort({ amount: -1 })
      .limit(1)
      .then((data) => {
        // console.log(data);
        return data[0];
      });
    response.status(200).json({ max_amount });
  } catch (error) {
    next(error);
  }
}

//function to get the previous value for max amount for item in auction 
exports.getPreviousMaxAmount = async (request, response, next) => {
  try {
    const { auction_id, item_id } = request.body;
    const max_amount = await bindingSchema
      .find({ auction_id: auction_id, item_id: item_id })
      .sort({ amount: -1 })
      .limit(2)
      .then((data) => {
        // console.log(data);
        return data[1];
      });
    response.status(200).json({ max_amount });
  } catch (error) {
    next(error);
  }
}
