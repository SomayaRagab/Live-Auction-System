const mongoose = require('mongoose');
require('./../Models/joinAuctionModel');
const joinAuctionSchema = mongoose.model('joinAuctions');

exports.joinAuction = async (req, res) => {
  try {
    // chexk if user already joined the auction
    const joined = await joinAuctionSchema.findOne({
      auction_id: req.body.auction_id,
      user_id: req.id,
    });
    if (joined) {
      return res.status(400).json({
        success: false,
        message: 'You already joined this auction...',
      });
    }

    const { auction_id } = req.body;
    const joinAuction = new joinAuctionSchema({
      auction_id,
      user_id: req.id,
    });
    await joinAuction.save();
    res.status(200).json({
      success: true,
      message: 'Joined auction successfully...',
      data: joinAuction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to join auction...',
      error: error.message,
    });
  }
};

// get user joined auctions
exports.getJoinedAuctions = async (req, res) => {
    try {
        const joinedAuctions = await joinAuctionSchema
        .find({ user_id: req.id })
        .populate( {path: 'auction_id',selected:{name:1 , image:1}});
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
    }


    // get user joined auctions
exports.getJoinedAuctions = async (req, res) => {

    try {
        const joinedAuctions = await joinAuctionSchema
        .find({ user_id: req.id })
        .populate( { path: 'auction_id', select: { name: 1 , start_date:1    } });
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
    }

    // check if user joined auction

    exports.checkIfUserJoinedAuction = async (req, res) => {
        try {
            const joined = await joinAuctionSchema.findOne({
                auction_id: req.params.id,
                user_id: req.id,
            });
            if (joined) {
                return res.status(200).json({
                    success: true,
                    message: 'User joined this auction...',
                    data: joined,
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'User not joined this auction...',
                    data: joined,
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Unable to check if user joined auction...',
                error: error.message,
            });
        }
    }
