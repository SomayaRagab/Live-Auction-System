// create model for card with fields _id, user_id, itemDetails_id, pay

const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const cardSchema = mongoose.Schema({
    _id: {
        type: Number,
    },
    user_id: {
        type: Number,
        ref: 'users',
        required: [true, 'User ID is required']
    },
    itemDetails_id: {
        type: Number,
        ref: 'itemDetails',
        required: [true, 'Item Details ID is required']
    },
    pay: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

cardSchema.plugin(autoIncrement, { id: 'card_id', inc_field: '_id' });
mongoose.model('cards', cardSchema);