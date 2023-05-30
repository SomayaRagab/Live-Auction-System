const mongoose = require('mongoose');

const autoIncrement = require('mongoose-sequence')(mongoose);
const auctionSchema = mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    reference_number: {
      type: Number,
      unique: true,
      required: [true, 'Reference Number is required'],
    },
    start_date: {
      type: Date,
      required: [true, 'Start Date is required'],
    },
    end_date: {
      type: Date,
      required: [true, 'End Date is required'],
    },
    time:  {
      type: String,
      match:[/^[0-2][0-3]:[0-5][0-9]$/,'Invalid Time'],
      required: [true, 'Time is required'],
    },
    fees: {
      type: Number,
      required: [true, 'Fees is required'],
    },
    status: {
      type: String,
      default: 'not started',
      enum: ['started', 'ended', 'not started'],
      required: [true, 'Status is required'],
    },
    items: {
      type: [Number],
      ref: 'itemDetails',
      required: [true, 'Items is required'],
    },
  },
  {
    timestamps: true,
  }
);

auctionSchema.plugin(autoIncrement, { id: 'auction_id', inc_field: '_id' });
const auctions = mongoose.model('auctions', auctionSchema);
