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
  end_time: {
    type: String,
    match: [/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/, 'Invalid Time'],
    required: [true, 'End Time is required'],
  },
});
itemDetailsSchema.plugin(Autoincrement, {
  id: 'itemDetails_id',
  inc_field: '_id',
});

mongoose.model('itemDetails', itemDetailsSchema);
