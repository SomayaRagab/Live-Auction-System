const mongoose = require('mongoose');
require('./../Models/bindingModel');
require('./../Models/itemDetailsModel');
require('./../Models/cardModel');
const bindingSchema = mongoose.model('biddings');
const itemDetailsSchema = mongoose.model('itemDetails');
const userSchema = mongoose.model('users');
const cardSchema = mongoose.model('cards');
const Pusher = require("pusher");

exports.addBidding = async (req, res) => {
  try {
    const { itemDetails_id, bide, user_id } = req.body;
    let amount = req.body.amount || 0;
    //fetch item details from item details table
    const itemDetails = await itemDetailsSchema.findById({
      _id: itemDetails_id,
    });

    if (!itemDetails) {
      res
        .status(400)
        .json({ success: false, error: 'Invalid item Details ID' });
      return;
    }
    // Fetch the user from the database
    const user = await userSchema.findOne({ _id: user_id });

    if (!user || user.block) {
      res.status(400).json({ success: false, error: 'Invalid user' });
      return;
    }
    if (itemDetails.flag == false) {
      res.status(400).json({ success: false, error: 'Bidding is closed' });
      return;
    }

    // Check if the bidding amount is greater than or bidding gap of the item
    if (bide < itemDetails.bidding_gap) {
      res.status(400).json({
        success: false,
        error: 'Bidding amount is less than the bidding gap of the item',
      });
      return;
    }

    amount += itemDetails.current_price + bide;

    if (amount >= itemDetails.max_price) {
      //update the value of flag field in item details table
      await itemDetailsSchema.updateOne(
        { _id: itemDetails_id },
        { flag: false }
      );
      // console.log(user_id);
      // console.log(itemDetails_id);
      // console.log(amount);
      // create card for the winner
      const card = await new cardSchema({
        user_id,
        item_id,
        price: amount,
      });
      await card.save();
    }
    //create function to update the current price in item details table using pusher
    const pusher = new Pusher({
      appId: "1623189",
      key: "6674d9bc1d0e463c0241",
      secret: "ba6883242149b4e12a0b",
      cluster: "eu",
      useTLS: true
    });
    
    // Update the current_price
    await itemDetailsSchema.updateOne(
      { _id: itemDetails_id },
      { current_price: amount }
    );
    
    // Trigger the event to notify clients
    pusher.trigger("Auction_id", "itemDetails_id" , {
      // message: "hello world",
      current_price: amount // Include the updated current_price in the event data
    });
    
    const bidding = new bindingSchema({
      itemDetails_id,
      user_id,
      amount,
    });

    // Save the bidding to the database
    await bidding.save();

    res.status(201).json({ success: true, data: bidding });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

//function to delete biddeing
exports.deleteBidding = async (req, res) => {
  try {
    // const { _id } = req.body;
    bindingSchema.findByIdAndDelete(req.params.id).then((data) => {
      // if there is no bidding with this id
      if (!data) {
        res.status(404).json({ message: 'Bidding not found' });
      } else {
        res.status(200).json({ message: 'Bidding deleted successfully' });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get all biddings

exports.getAllBiddings = (request, response, next) => {
  bindingSchema
    .find({})
    .populate({ path: 'user_id', select: { name: 1 } })
    // .populate({path:'item_id',select:{name:1 ,image:1}})
    .populate({ path: 'itemDetails_id', select: { name: 1 } })
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};

//function to get the max amount for item in auction
exports.getWinner = async (req, res, next) => {
  try {
    const winner = await bindingSchema
      .findOne(
        {
          itemDetails_id: req.params.itemDetails_id,
        },
        {
          user_id: 1,
          amount: 1,
        }
      )
      .populate({ path: 'user_id', select: { email: 1, name: 1 } })
      .populate({ path: 'itemDetails_id', select: { item_id: 1 } })

      .sort({ amount: -1 })
      .limit(1)
      .then((data) => {
        return data;
      });

    if (!winner) {
      throw new Error('no winner');
    }

    await new cardSchema({
      user_id: winner.user_id._id,
      itemDetails_id: req.params.itemDetails_id,
      price: winner.amount,
    }).save();

    // get item from item details table

    res.status(200).json({ winner });
  } catch (error) {
    next(error);
  }
};

//function to get the previous value for max amount for item in auction
exports.getPreviousMaxAmount = async (request, response, next) => {
  try {
    const { itemDetails_id } = request.body;
    const max_amount = await bindingSchema
      .find({ itemDetails_id: itemDetails_id })
      .sort({ amount: -1 })
      .limit(2)
      .then((data) => {
        return data[1];
      });
    response.status(200).json({ max_amount });
  } catch (error) {
    next(error);
  }
};
