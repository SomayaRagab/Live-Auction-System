const mongoose = require('mongoose');
const autions=mongoose.model('auctions');
const items=mongoose.model('items');
const users=mongoose.model('users');
const autoIncrement = require('mongoose-sequence')(mongoose);

const biddingSchema = mongoose.Schema({
    _id: {
        type: Number,
    },
    auction_id: {
        type: Number,
        ref: autions,
        required: [true, 'Auction ID is required']
    },
    item_id: {
        type: Number,
        ref: items,
        required: [true, 'Item ID is required']
    },
    user_id: {
        type: Number,
        ref: users,
        required: [true, 'User ID is required']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        default:0
    },
}
    , {
        timestamps: true
    }
);

biddingSchema.plugin(autoIncrement, { id: 'bidding_id', inc_field: '_id' });
const biddings = mongoose.model('biddings', biddingSchema);
