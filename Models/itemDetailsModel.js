const mongoose = require('mongoose');
const Autoincrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;
const itemDetailsSchema = new Schema({
  _id: {
    type: Number,
  },
  bidding_gap: {
    type: Number,
    required: [true, 'فارق المزايدة مطلوب'],
  },
  start_bidding: {
    type: Number,
    required: [true, 'بدء المزايدة مطلوب'],
  },
  max_price: {
    type: Number,
    required: [true, 'السعر الأقصى مطلوب'],
  },
  current_price: {
    type: Number,
    default: 0,
  },
  item_id: {
    type: Number,
    ref: 'items',
    required: [true, 'معرف المنتج مطلوب'],
  },
  auction_id: {
    type: Number,
    ref: 'auctions',
    required: [true, 'معرف المزاد مطلوب'],
  },
  start_date: {
    type: Date,
    required: [true, 'تاريخ البدء مطلوب'],
  },

  duration: {
    type: Number,
    required: [true, 'المدة مطلوبة'],
  },
  is_open: {
    type: Boolean,
    default: true,
  },
});
itemDetailsSchema.plugin(Autoincrement, {
  id: 'itemDetails_id',
  inc_field: '_id',
});

mongoose.model('itemDetails', itemDetailsSchema);
