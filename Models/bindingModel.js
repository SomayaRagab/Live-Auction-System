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
        required: [true, 'معرف تفاصيل المنتج مطلوب']
    },
    user_id: {
        type: Number,
        ref: users,
        required: [true, 'معرف المستخدم مطلوب']
    },
    amount: {
        type: Number,
        required: [true, 'المبلغ مطلوب'],
        default:0
    },
}
    , {
        timestamps: true
    }
);

biddingSchema.plugin(autoIncrement, { id: 'bidding_id', inc_field: '_id' });
const biddings = mongoose.model('biddings', biddingSchema);
