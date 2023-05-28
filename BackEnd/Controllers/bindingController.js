const mongoose = require('mongoose');
require('./../Models/bindingModel');
const bindingSchema = mongoose.model('biddings');

const addBidding = (req, res) => {
  const newBidding = new bindingSchema(req.body);
  newBidding.save((err, bidding) => {
    if (err) {
      res.send(err);
    }
    res.json(bidding);
  });
};

const getAllBiddings = (req, res) => {
  bindingSchema.find({}, (err, bidding) => {
    if (err) {
      res.send(err);
    }
    res.json(bidding);
  });
};

const getBiddingById = (req, res) => {
  bindingSchema.findById(req.params.id, (err, bidding) => {
    if (err) {
      res.send(err);
    }
    res.json(bidding);
  });
};
