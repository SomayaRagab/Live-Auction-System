const mongoose = require('mongoose');
require('./../Models/auctionModel');

const auctionSchema = mongoose.model('auctions');
const itemSchema = mongoose.model('items');

//Get All Auctions
exports.getAllAuctions = (request, response, next) => {
  auctionSchema
    .find({})
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};

//Get Auction By ID
exports.getAuctionById = (request, response, next) => {
  auctionSchema
    .findById(request.params.id)
    .then((data) => {
      // if there is no auction with this id
      if (!data) {
        response.status(404).json({ message: 'Auction not found' });
      } else {
        response.status(200).json({ data });
      }
    })
    .catch((error) => next(error));
};

//Add Auction
exports.addAuction = async (req, res, next) => {
  try {
    //check if all items in array are item id or not in items schema
    const items = req.body.items;
    const itemsLength = items.length;
    for (let i = 0; i < itemsLength; i++) {
      const item = await itemSchema.findOne({ _id: items[i] });
      if (!item) {
        res.status(400).json({ error: 'Invalid item ID' });
        return;
      }
    }
    const auction = new auctionSchema({
      name: req.body.name,
      reference_number: req.body.reference_number,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      time: req.body.time,
      fees: req.body.fees,
    });

    const newAuction = await auction.save();
    res.status(201).json(newAuction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

//Update Auction

exports.updateAuction = (request, response, next) => {
  auctionSchema
    .findByIdAndUpdate(request.params.id, request.body)
    .then((data) => {
      // if there is no auction with this id
      if (data.length == 0) {
        response.status(404).json({ message: 'Auction not found' });
      } else {
        response.status(200).json({ data });
      }
    })
    .catch((error) => next(error));
};

//Delete Auction
exports.deleteAuction =async (request, response, next) => {
  const Auctions = await itemDetailsSchema.find({ item_id: req.params.id });
  if (Auctions) {
    return res.status(400).json({ error: 'Auctions is used in itemDetails' });

  }
  auctionSchema
    .findByIdAndDelete(request.params.id)
    .then((data) => {
      // if there is no auction with this id
      if (!data) {
        response.status(404).json({ message: 'Auction not found' });
      } else {
        response.status(200).json({ data });
      }
    })
    .catch((error) => next(error));
};

//Get Auctions By Status
exports.getAuctionsByStatus = (request, response, next) => {
  auctionSchema
    .find({ status: request.params.status })
    .then((data) => {
      // if there is no auction with this status
      if (data.length == 0) {
        response.status(404).json({ message: 'Auction not found.' });
      } else {
        response.status(200).json({ message: 'Auctions deleted successfuly.' });
      }
    })
    .catch((error) => next(error));
};

//Get Auctions By Name
exports.getAuctionsByName = (request, response, next) => {
  auctionSchema.find({ name: request.params.name }).then((data) => {
    // if there is no auction with this name
    if (data.length == 0) {
      response.status(404).json({ message: 'Auction not found' });
    } else {
      response.status(200).json({ message: 'Auctions deleted successfuly.' });
    }
  });
};
