const mongoose = require('mongoose');
require('./../Models/bindingModel');
require('./../Models/itemDetailsModel');
const bindingSchema = mongoose.model('biddings');
const itemDetailsSchema = mongoose.model('itemDetails');
const userSchema = mongoose.model('users');

exports.addBidding = async (req, res) => {
  try {
    const { itemDetails_id , bide , user_id } = req.body;
    let amount = req.body.amount || 0;
    // const user_id = req.id;

    //fetch item details from item details table
    const itemDetails = await itemDetailsSchema.findById({ _id: itemDetails_id});

    if (!itemDetails) {
      res.status(400).json({ success: false, error: 'Invalid item Details ID' });
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
      // console.log('bide', bide);
      // console.log('itemDetails.bidding_gap', itemDetails.bidding_gap);
      res.status(400).json({
        success: false,
        error: 'Bidding amount is less than the bidding gap of the item',
      });
      return;
    }

    amount += itemDetails.current_price + bide;
    

    if (amount > itemDetails.max_price) {
      res.status(400).json({
        success: false,
        error: 'Bidding amount is greater than the max price of the item',
      });
      return;
    }

    await itemDetailsSchema.updateOne(
      { _id: itemDetails_id},
      { current_price: amount }
    );


    const bidding = new bindingSchema ({
      itemDetails_id,
      user_id,
      amount,
    });


    // Save the bidding to the database
    await bidding.save();

    res.status(201).json({ success: true, data: bidding });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message});
  }
};


// get all biddings

exports.getAllBiddings = (request, response, next) => {
  bindingSchema
    .find({})
    .populate({path:'user_id',select:{name:1}})
    .populate({path:'item_id',select:{name:1 ,image:1}})
    .populate({path:'auction_id',select:{name:1}})
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
}

//function to get the max amount for item in auction
exports.getMaxAmount = async (request, response, next) => {
  try {
    const { itemDetails_id } = request.body;
    const max_amount = await bindingSchema
      .find({ itemDetails_id:itemDetails_id })
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
    const { itemDetails_id } = request.body;
    const max_amount = await bindingSchema
      .find({ itemDetails_id:itemDetails_id })
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
