const mongoose = require('mongoose');
// const autions=mongoose.model('auctions');
const itemDetails=mongoose.model('itemDetails');
const users=mongoose.model('users');
const autoIncrement = require('mongoose-sequence')(mongoose);

const biddingSchema = mongoose.Schema({
    _id: {
        type: Number,
    },
    itemDetails_id :{
        type: Number,
        ref: itemDetails,
        required: [true, 'Item Detailes ID is required']
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
