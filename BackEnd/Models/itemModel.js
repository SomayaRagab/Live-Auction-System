const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const schema = new mongoose.Schema({
  _id: Number,
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  images: { type: String, required: true },
  material: { type: String, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  deliveryTime: { type: Date },
  shippingType: { type: String, enum: ["Percentage", "Amount"] },
  estimatedShipping: { type: Date },
  category: { type: Number, ref: "categories" },

});
schema.plugin(AutoIncrement, { id: "item_id", inc_field: "_id" });
mongoose.model("items", schema);