const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const schema = new mongoose.Schema(
  {
    _id: Number,
    name: { type: String, required: [true, 'Name is required...'] },
    qty: { type: Number, required: [true, 'Qty is required'] },
    image: { type: String, required: [true, 'Image is required'] },
    material: { type: String, required: [true, 'Material is required'] },
    size: { type: String, required: [true, 'Size is required'] },
    color: { type: String, required: [true, 'Color is required'] },
    category: { type: [Number], ref: 'categories' },
  },
  { timestamps: true }
);
schema.plugin(AutoIncrement, { id: 'item_id', inc_field: '_id' });
mongoose.model('items', schema);
