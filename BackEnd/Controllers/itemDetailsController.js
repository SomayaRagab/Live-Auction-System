const mongoose = require('mongoose');
require('./../Models/itemDetailsModel');
const items = mongoose.model('items');
const itemDetailsSchema = mongoose.model('itemDetails');

exports.createItemDetails= async (req, res) => {
  
  try {
    const item = await items.findById(req.body.item_id);
    if (!item) throw new Error('Item not found');
    const itemDetails = new itemDetailsSchema(
        {
            _id: req.body.id,
            bidding_gap: req.body.bidding_gap,
            start_bidding: req.body.start_bidding,
            max_price: req.body.max_price,
            item_id: req.body.item_id,
            end_time: req.body.end_time,
        }
    );
    const savedItem = await itemDetails.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getItemDetails = async (req, res) => {
  try {
    const allItems = await itemDetailsSchema.find();
    res.status(200).json(allItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getItemDetailsById = async (req, res) => {
  try {
    const itemDetails = await itemDetailsSchema.findById(req.params.id);
    if (!itemDetails) throw new Error('Item Details not found');
    res.status(200).json(itemDetails);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.updateItemDetails = async (req, res) => {
  try {
    const item = await items.findById(req.body.item_id);
    if (!item) throw new Error('Item not found');
    const itemDetails = await itemDetailsSchema.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!itemDetails) throw new Error('Item  Details not found');
    res.status(200).json(itemDetails);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteItemDetails = async (req, res) => {
  try {
    const itemDetails = await itemDetailsSchema.findByIdAndDelete(req.params.id);
    if (!itemDetails) throw new Error('Item Details not found');
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


