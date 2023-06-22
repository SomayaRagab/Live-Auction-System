const mongoose = require('mongoose');
require('./../Models/cardModel');
const cardSchema = mongoose.model('cards');

// get all winner to the database

exports.getAllWinner = async (req, res) => {
  // get all item and auction for winner from cardSchema with aggregate
  const query = [
    {
      $lookup: {
        from: 'itemdetails',
        localField: 'itemDetails_id',
        foreignField: '_id',
        as: 'itemdetails',
      },
    },
    {
      $unwind: '$itemdetails',
    },
    {
      $lookup: {
        from: 'auctions',
        localField: 'itemdetails.auction_id',
        foreignField: '_id',
        as: 'auctions',
      },
    },
    {
      $unwind: '$auctions',
    },
    {
      $lookup: {
        from: 'items',
        localField: 'itemdetails.item_id',
        foreignField: '_id',
        as: 'items',
      },
    },
    {
      $unwind: '$items',
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'users',
      },
    },
    {
      $unwind: '$users',
    },
    {
      // get user name and email , item name and image , auction name
      $project: {
        _id: 1,
        user_id: 1,
        itemDetails_id: 1,
        price: 1,
        'users.name': 1,
        'users.email': 1,
        'items.name': 1,
        'items.image': 1,
        'auctions.name': 1,
      },
    },
  ];

  try {
    const allWinner = await cardSchema.aggregate(query);
    res.status(200).json({ data: allWinner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get all itemDetails for logged in user IN cardSchema

exports.getWinnerItems = async (req, res, next) => {
  // get all item and auction for winner in logged from cardSchema with aggregate
  const query = [
    {
      $match: {
        user_id: req.id,
      },
    },
    {
      $lookup: {
        from: 'itemdetails',
        localField: 'itemDetails_id',
        foreignField: '_id',
        as: 'itemdetails',
      },
    },
    {
      $unwind: '$itemdetails',
    },
    {
      $lookup: {
        from: 'auctions',
        localField: 'itemdetails.auction_id',
        foreignField: '_id',
        as: 'auctions',
      },
    },
    {
      $unwind: '$auctions',
    },
    {
      $lookup: {
        from: 'items',
        localField: 'itemdetails.item_id',
        foreignField: '_id',
        as: 'items',
      },
    },
    {
      $unwind: '$items',
    },
    {
      $project: {
        _id: 1,
        user_id: 1,
        itemDetails_id: 1,
        price: 1,
        'items.name': 1,
        'items.image': 1,
        'auctions.name': 1,
        'auctions.start_date': 1,
      },
    },
  ];

  try {
    const itemWinner = await cardSchema.aggregate(query);
    if (!itemWinner) {
      throw new Error('No winner');
    }
    res.status(200).json({ data: itemWinner });
  } catch (err) {
    next(err);
  }
};

// delete cardSchema by id

exports.deleteCard = async (req, res, next) => {
  try {
    const card = await cardSchema.findOneAndDelete({
      _id: req.params.id,
    });
    if (!card) {
      throw new Error('Card not found');
    }
    res.status(200).json({ message: 'Card deleted successfully' });
  } catch (err) {
    next(err);
  }
};
