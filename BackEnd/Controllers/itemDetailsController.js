const mongoose = require('mongoose');
require('./../Models/itemDetailsModel');
require('./../Models/auctionModel');
const auctions = mongoose.model('auctions');
const items = mongoose.model('items');
const itemDetailsSchema = mongoose.model('itemDetails');


exports.createItemDetails = async (req, res) => {
  try {
    const item = await items.findById(req.body.item_id);
    const auction = await auctions.findById(req.body.auction_id);
    if (!item) throw new Error('Item not found');
    if (!auction) throw new Error('Auction not found');

    // caculate end date
    const date = addTimeToDate(auction.end_date, req.body.end_time);

    // update auction end date
    auction.end_date = date;
    await auction.save();

    console.log(date);
    const itemDetails = new itemDetailsSchema({
      _id: req.body.id,
      bidding_gap: req.body.bidding_gap,
      start_bidding: req.body.start_bidding,
      max_price: req.body.max_price,
      item_id: req.body.item_id,
      auction_id: req.body.auction_id,
      end_time: req.body.end_time,
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
      .populate({ path: 'auction_id', select: { name: 1  } });
    res.status(200).json({ data: allItems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getItemDetailsById = async (req, res) => {
  try {
    const itemDetails = await itemDetailsSchema
      .findById(req.params.id)
      .populate({ path: 'item_id', select: { name: 1 , image:1 } })
      .populate({ path: 'auction_id', select: { name: 1} });
    if (!itemDetails) throw new Error('Item Details not found');
    res.status(200).json(itemDetails);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.updateItemDetails = async (req, res) => {
  try {
    if (req.body.item_id && !(await items.findById(req.body.item_id)))
      throw new Error('Item not found');

    if (req.body.auction_id && !(await auctions.findById(req.body.auction_id)))
      throw new Error('Auction not found');

    const itemDetails = await itemDetailsSchema.updateOne(
      { _id: req.params.id },
      {
        $set: {
          bidding_gap: req.body.bidding_gap,
          start_bidding: req.body.start_bidding,
          max_price: req.body.max_price,
          item_id: req.body.item_id,
          auction_id: req.body.auction_id,
          end_time: req.body.end_time,
        },
      }
    );
    console.log(itemDetails);
    if (itemDetails.matchedCount == 0)
      throw new Error('Item  Details not found');
    res.status(200).json({ message: 'Item Details updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteItemDetails = async (req, res) => {
  try {
    const itemDetails = await itemDetailsSchema.findByIdAndDelete(
      req.params.id
    );
    if (!itemDetails) throw new Error('Item Details not found');
    res.status(200).json({ message: 'Item Details deleted successfully' });
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
      .populate({ path: 'item_id', select: { name: 1, image: 1 } });
    if (!itemsDetails) throw new Error('Item Details not found');
    res.status(200).json(itemsDetails);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

function addTimeToDate(date, time ) {
  console.log(date);
  [hours, minutes] = time.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setHours(date.getHours() + hours);
  newDate.setMinutes(date.getMinutes() + minutes);
 
  return newDate;
}