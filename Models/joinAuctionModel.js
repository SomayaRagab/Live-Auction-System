const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const schema = new mongoose.Schema(
  {
    _id: Number,
    auction_id: {
      type: Number,
      ref: 'auctions',
      required: [true, 'Auction Id is required...'],
    },
    user_id: {
      type: Number,
      ref: 'users',
      required: [true, 'User Id is required'],
    },
    is_fees_paid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
schema.plugin(AutoIncrement, { id: 'joinAuctions_id', inc_field: '_id' });
mongoose.model('joinAuctions', schema);
