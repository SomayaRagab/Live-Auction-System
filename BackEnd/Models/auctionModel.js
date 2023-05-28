const mongoose = require("mongoose");

const autoIncrement = require("mongoose-sequence")(mongoose);
const erdGenerator = require('mongoose-erd-generator');

const auctionSchema = mongoose.Schema(
  {
    id: {
      type: Number,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    reference_number: {
      type: Number,
      required: [true, "Reference Number is required"],
    },
    start_date: {
      type: Date,
      required: [true, "Start Date is required"],
    },
    end_date: {
      type: Date,
      required: [true, "End Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    fees: {
      type: Number,
      required: [true, "Fees is required"],
    },
    status: {
      type: String,
      enum: ["started", "ended", "not started"],
      required: [true, "Status is required"],
    },
    items: {
      type: Array,
      ref: "items",
      required: [true, "Items is required"],
    },
  },
  {
    timestamps: true,
  }
);

erdGenerator(auctionSchema, {filename: 'auctionSchema.png'});
const erd = erdGenerator(auctionSchema);

console.log(erd); // returns the path of the generated erd

auctionSchema.plugin(autoIncrement, { id: "auction_id", inc_field: "id" });
const auctions = mongoose.model("auctions", auctionSchema);
