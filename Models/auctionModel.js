const mongoose = require('mongoose');

const autoIncrement = require('mongoose-sequence')(mongoose);
const auctionSchema = mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    name: {
      type: String,
      required: [true, 'اسم المزاد مطلوب'],
    },
    reference_number: {
      type: Number,
      unique: true,
      required: [true, 'الرقم المرجعي  مطلوب'],
    },
    start_date: {
      type: Date,
      required: [true, 'تاريخ البدء مطلوب'],
    },
    end_date: {
      type: Date,
      default:null,
      required: [true, 'تاريخ الانتهاء مطلوب'],
    },
    fees: {
      type: Number,
      required: [true, 'الرسوم مطلوبة'],
    },
    status: {
      type: String,
      default: 'not started',
      enum: ['started', 'ended', 'not started'],
      required: [true, 'الحالة مطلوبة'],
    },
  },
  {
    timestamps: true,
  }
);

auctionSchema.plugin(autoIncrement, { id: 'auction_id', inc_field: '_id' });
const auctions = mongoose.model('auctions', auctionSchema);
