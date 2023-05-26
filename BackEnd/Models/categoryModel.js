const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const schema = new mongoose.Schema({
  _id: Number,
  name: { type: String, required: true },
});

schema.plugin(AutoIncrement, { id: "category_id", inc_field: "_id" });
mongoose.model("categories", schema);
