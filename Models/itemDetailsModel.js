const mongoose = require('mongoose');
const Autoincrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;
const itemDetailsSchema = new Schema({
  _id: {
    type: Number,
  },
  bidding_gap: {
    type: Number,
    required: [true, 'Bidding Gap is required'],
  },
  start_bidding: {
    type: Number,
    required: [true, 'Start Bidding is required'],
  },
  max_price: {
    type: Number,
    required: [true, 'Max Price is required'],
  },
  current_price: {
    type: Number,
    default: 0,
  },
  item_id: {
    type: Number,
    ref: 'items',
    required: [true, 'Item Id is required'],
  },
  auction_id: {
    type: Number,
    ref: 'auctions',
    required: [true, 'Auction Id is required'],
  },
  start_date: {
    type: Date,
    required: [true, 'Start Date is required'],
  },

  duration: {
    type: Number,
    required: [true, 'Duration is required'],
  },
  is_open: {
    type: Boolean,
    default: false,
  },
});
itemDetailsSchema.plugin(Autoincrement, {
  id: 'itemDetails_id',
  inc_field: '_id',
});

mongoose.model('itemDetails', itemDetailsSchema);