const mongoose = require('mongoose');
require('./../Models/joinAuctionModel');
require('./../Models/auctionModel');
const joinAuctionSchema = mongoose.model('joinAuctions');
const auctionSchema = mongoose.model('auctions');

exports.joinAuction = async (req, res, next) => {
  try {
    // check if auction is started
    const auction = await auctionSchema.findOne({
      _id: req.body.auction_id,
      status: 'not started',
    });
    if (!auction) throw new Error('لا يمكنك الانضمام للمزاد لانه بدء');
    // check if user already joined the auction and paid the fees
    const joined = await joinAuctionSchema.findOne({
      auction_id: req.body.auction_id,
      user_id: req.id,
      is_fees_paid: true,
    });
    if (joined) {
      return res.status(400).json({
        success: false,
        message: 'لفد انضممت للمزاد بالفعل مسبقا ',
      });
    }
    // check if auction   has not fees
    if (auction.fees != 0)
      throw new Error('لا يمكنك الانضمام للمزاد لانه يحتاج تامين');
    const { auction_id } = req.body;
    const joinAuction = new joinAuctionSchema({
      auction_id,
      user_id: req.id,
      is_fees_paid: true,
    });
    await joinAuction.save();
    res.status(200).json({
      success: true,
      message: 'تم الانضمام للمزاد بنجاح',
      data: joinAuction,
    });
  } catch (error) {
    next(error);
  }
};

// get user joined auctions
exports.getJoinedAuctions = async (req, res) => {
  try {
    const joinedAuctions = await joinAuctionSchema
      .find({ user_id: req.id })
      .populate({ path: 'auction_id', select: { name: 1, start_date: 1 } });
    res.status(200).json({
      success: true,
      message: 'Joined auctions fetched successfully...',
      data: joinedAuctions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to fetch joined auctions...',
      error: error.message,
    });
  }
};
