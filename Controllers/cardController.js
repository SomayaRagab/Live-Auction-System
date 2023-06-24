const mongoose = require('mongoose');
require('./../Models/cardModel');
const cardSchema = mongoose.model('cards');

// get all winner to the database

exports.getAllWinner = async (req, res,next) => {
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
      // get user name and email , item name and image , auction name createdAt
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
        pay: 1,
        createdAt: 1,
      },
    },
  ];

  try {
    const allWinner = await cardSchema.aggregate(query);
    if(allWinner.length===0){
      throw new Error('No winners items');
    }
    res.status(200).json({ data: allWinner });
  } catch (err) {
    next(err);
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
    if (itemWinner.length === 0) {
      throw new Error('No winner items');
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

// get all pay true for logged in user

exports.getPayedItems = async (req, res, next) => {
  try {
    const qury = [
      {
        $match: {
          user_id: req.id,
          pay: true,
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
          pay: 1,
          'items.name': 1,
          'items.image': 1,
          'auctions.name': 1,
          'auctions.start_date': 1,
        },
      },
    ];
    const payedItems = await cardSchema.aggregate(qury);
    if (payedItems.length === 0) {
      throw new Error('No payed items');
    }
    res.status(200).json({
      status: 'success',
      data: payedItems,
    });
  } catch (error) {
    next(error);
  }
};

// get all not pay false for logged in user

exports.getNotPayedItems = async (req, res, next) => {
  try {
    const qury = [
      {
        $match: {
          user_id: req.id,
          pay: false,
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
          pay: 1,
          'items.name': 1,
          'items.image': 1,
          'auctions.name': 1,
          'auctions.start_date': 1,
        },
      },
    ];

    const notPayedItems = await cardSchema.aggregate(qury);
    if (notPayedItems.length === 0) {
      throw new Error('No not payed items');
    }
    res.status(200).json({
      status: 'success',
      data: notPayedItems,
    });
  } catch (error) {
    next(error);
  }
};
