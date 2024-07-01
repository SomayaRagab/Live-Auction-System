const mongoose = require('mongoose');
require('./../Models/joinAuctionModel');
require('./../Models/auctionModel');
const joinAuctionSchema = mongoose.model('joinAuctions');
const auctionSchema = mongoose.model('auctions');

// exports.joinAuction = async (req, res, next) => {
//   try {
//     // check if auction is started
//     const auction = await auctionSchema.findOne({
//       _id: req.body.auction_id,
//       status: 'not started',
//     });
//     if (!auction) throw new Error('لا يمكنك الانضمام للمزاد لانه بدء');
//     // check if user already joined the auction and paid the fees
//     const joined = await joinAuctionSchema.findOne({
//       auction_id: req.body.auction_id,
//       user_id: req.id,
//     });
//     console.log(joined);
//     if (joined && joined.is_fees_paid) {
//       return res.status(400).json({
//         success: false,
//         message: 'لفد انضممت للمزاد بالفعل مسبقا ',
//       });
//     }
//     // check if auction   has not fees
//     if (auction.fees != 0 && !joined)
//       throw new Error('لا يمكنك الانضمام للمزاد لانه يحتاج تامين');
//     const { auction_id } = req.body;
//     const joinAuction = new joinAuctionSchema({
//       auction_id,
//       user_id: req.id,
//       is_fees_paid: true,
//     });
//     await joinAuction.save();
//     res.status(200).json({
//       success: true,
//       message: 'تم الانضمام للمزاد بنجاح',
//       data: joinAuction,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// get user joined auctions

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
    });

  

    if (joined && joined.is_fees_paid) {
      return res.status(400).json({
        success: false,

        message: 'لفد انضممت للمزاد بالفعل مسبقا ',
      });
    }

    // check if auction   has not fees

    if (auction.fees != 0 && !joined)
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


exports.getJoinedAuctions = async (req, res) => {
  try {
    const joinedAuctions = await joinAuctionSchema
      .find({ user_id: req.id })
      .populate({ path: 'auction_id', select: { name: 1, start_date: 1 } });
    res.status(200).json({
      success: true,
      message: 'تم جلب المزادات المشترك فيها بنجاح...',
      data: joinedAuctions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'تعذر جلب المزادات المشترك فيها...',
      error: error.message,
    });
  }
};

// get all join auctions
exports.getAllJoinAuctions = async (req, res) => {
  try {
    const joinedAuctions = await joinAuctionSchema
      .find()
      .populate({ path: 'auction_id', select: { name: 1, start_date: 1 } });
    res.status(200).json({
      success: true,
      message: 'تم جلب المزادات المشترك فيها بنجاح...',
      data: joinedAuctions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'تعذر جلب المزادات المشترك فيها...',
      error: error.message,
    });
  }
}
