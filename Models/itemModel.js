const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const schema = new mongoose.Schema(
  {
    _id: Number,
    name: { type: String, required: [true, 'الاسم مطلوب'] },
    qty: { type: Number, required: [true, 'الكمية مطلوبة'] },
    image: { type: String, required: [true, 'الصورة مطلوبة'] },
    material: { type: String, required: [true, 'المادة  الخام مطلوبة'] },
    size: { type: String, required: [true, 'الحجم مطلوب'] },
    color: { type: String, required: [true, 'اللون مطلوب'] },
    category: { type: Number, ref: 'categories' },
  },
  { timestamps: true }
);
schema.plugin(AutoIncrement, { id: 'item_id', inc_field: '_id' });
mongoose.model('items', schema);
