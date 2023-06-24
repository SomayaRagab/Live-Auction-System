const mongoose = require('mongoose');
require('./../Models/itemDetailsModel');
require('./../Models/auctionModel');
const auctions = mongoose.model('auctions');
const items = mongoose.model('items');
const itemDetailsSchema = mongoose.model('itemDetails');

const {
  addTimeToDate,
  addDurationToDate,
} = require('./../Helper/calculateDate');

exports.createItemDetails = async (req, res) => {
  try {
    const item = await items.findById(req.body.item_id);
    const auction = await auctions.findById(req.body.auction_id);
    if (!item || item.qty == 0) throw new Error('المنتج غير موجود');
    if (!auction) throw new Error('المزاد غير موجود');

    // check start date item is greater than start date auction
    if (new Date(req.body.start_date) < new Date(auction.start_date)) {
      throw new Error(
        'تاريخ بدايه المنتج يجب ان يكون نفس يوم المزاد او بعده من تاريخ بدايه المزاد'
      );
    }

    // caculate end date
    const itemDate = addTimeToDate(req.body.start_date, req.body.start_time);

    // update auction end date
    auction.end_date = addDurationToDate(itemDate, req.body.duration);
    await auction.save();

    const itemDetails = new itemDetailsSchema({
      _id: req.body.id,
      bidding_gap: req.body.bidding_gap,
      start_bidding: req.body.start_bidding,
      max_price: req.body.max_price,
      item_id: req.body.item_id,
      auction_id: req.body.auction_id,
      duration: req.body.duration,
      start_date: itemDate,
    });
    const savedItem = await itemDetails.save();
    res.status(201).json({ data: savedItem });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getItemDetails = async (req, res) => {
  try {
    const allItems = await itemDetailsSchema
      .find()
      .populate({ path: 'item_id', select: { name: 1, image: 1 } })
      .populate({ path: 'auction_id', select: { name: 1 } });
    res.status(200).json({ data: allItems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getItemDetailsById = async (req, res) => {
  try {
    const itemDetails = await itemDetailsSchema
      .findById(req.params.id)
      .populate({ path: 'item_id', select: { name: 1, image: 1 } })
      .populate({ path: 'auction_id', select: { name: 1 } });
    if (!itemDetails) throw new Error('تفاصيل المنتج غير موجودة');
    res.status(200).json(itemDetails);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.updateItemDetails = async (req, res) => {
  try {
    // check if item details exist
    const itemDetails = await itemDetailsSchema
      .findById(req.params.id)
      .populate({ path: 'auction_id', select: { end_date: 1 } });
    if (!itemDetails) throw new Error('تفاصيل المنتج غير موجودة');

    // check if item exist
    if (
      req.body.item_id &&
      !(await items.findOne({ _id: req.body.item_id, qty: 0 }))
    )
      throw new Error('المنتج غير موجود');

    // check if auction exist
    if (req.body.auction_id && !(await auctions.findById(req.body.auction_id)))
      throw new Error('المزاد غير موجود');

    // check if start date item is greater than start date auction
    if (req.body.start_date && req.body.start_time && req.body.duration) {
      // caculate end date
      const itemDate = addTimeToDate(req.body.start_date, req.body.start_time);

      // check start date item is greater than end date auction
      if (
        !(
          new Date(req.body.start_date) >
          new Date(itemDetails.auction_id.end_date)
        )
      )
        throw new Error(
          `تاريخ بدايه المنتج يجب ان يكون بعد   ${itemDetails.auction_id.end_date}`
        );

      // update auction end date
      const auction = await auctions.findById(itemDetails.auction_id._id);
      auction.end_date = addDurationToDate(itemDate, req.body.duration);
      await auction.save();
      

      req.body.start_date = itemDate;
    }

    await itemDetailsSchema.updateOne(
      { _id: req.params.id },
      {
        $set: {
          bidding_gap: req.body.bidding_gap,
          start_bidding: req.body.start_bidding,
          max_price: req.body.max_price,
          item_id: req.body.item_id,
          auction_id: req.body.auction_id,
          duration: req.body.duration,
          start_date: req.body.start_date,
        },
      }
    );

    res.status(200).json({ message: ' تفاصيل المنتج تغيره نجاح ' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteItemDetails = async (req, res) => {
  try {
    const itemDetails = await itemDetailsSchema.findByIdAndDelete(
      req.params.id
    );
    if (!itemDetails) throw new Error('تفاصيل المنتج غير موجودة');
    res.status(200).json({ message: 'تفاصيل المنتج اتمسحت بنجاح' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// get item details by auction id
exports.getItemDetailsByAuctionId = async (req, res) => {
  try {
    const itemsDetails = await itemDetailsSchema
      .find({
        auction_id: req.params.id,
      })
      .populate({
        path: 'item_id',
        select: { name: 1, image: 1, material: 1 },
      });
    if (!itemsDetails) throw new Error('تفاصيل المنتج غير موجودة');

    // update flag for item details if start date item , start time item and duration item is less than now
    for (let itemDetails of itemsDetails) {
      const now = Date.now() + 180 * 60000;

      if (
        addDurationToDate(itemDetails.start_date, itemDetails.duration) <
        new Date(now).toISOString()
      ) {
          itemDetails.is_open = false;
        await itemDetails.save();
      }
    }
    res.status(200).json(itemsDetails);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

//change flag for item details
exports.openBide = async (req, res) => {
  try {
    const itemDetails = await itemDetailsSchema.updateOne(
      { _id: req.params.id },
      {
        $set: {
          is_open: true,
        },
      }
    );

    if (itemDetails.matchedCount == 0)
      throw new Error('تفاصيل المنتج غير موجودة');
    res.status(200).json({ message: ' تفاصيل المنتج تغيره نجاح ' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.closeBide = async (req, res) => {
  try {
    const itemDetails = await itemDetailsSchema.updateOne(
      { _id: req.params.id },
      {
        $set: {
          is_open: false,
        },
      }
    );

    if (itemDetails.matchedCount == 0)
      throw new Error('تفاصيل المنتج غير موجودة');
    res.status(200).json({ message: ' تفاصيل المنتج تغيره نجاح ' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
