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
  end_time: {
    type: Date,
    required: [true, 'End Time is required'],
  },
});
mongoose.model('itemDetails', itemDetailsSchema);
itemDetailsSchema.plugin(Autoincrement, {
  id: 'itemDetails_id',
  inc_field: '_id',
});
