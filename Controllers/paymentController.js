const mongoose = require('mongoose');
require('../Models/itemDetailsModel');
require('../Models/cardModel');
const bcrypt = require('bcrypt');
const cardSchema = mongoose.model('cards');
const itemDetailsSchema = mongoose.model('itemDetails');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res, next) => {
  try {
    // get item name , image , auction name , user email for winner in logged and itemDetails id from cardSchema with aggregate
    const userData = await cardSchema
      .findOne({ itemDetails_id: req.params.id, user_id: req.id, pay: false })
      .populate({ path: 'user_id', select: { email: 1 } });
    if (!userData) {
      res.status(404).json({ status: 'fail', message: 'no winner found' });
      return;
    }
    const itemDetails = await itemDetailsSchema.findById(req.params.id);
    if (!itemDetails) {
      res.status(404).json({ status: 'fail', message: 'no itemDetails found' });
      return;
    }

    const winner = await itemDetailsSchema
      .findById(req.params.id)
      .populate({ path: 'auction_id', select: { name: 1 } })
      .populate({ path: 'item_id', select: { name: 1, image: 1 } });

    // create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment', // specify the payment mode at the top level
      success_url: `${req.protocol}://${req.get('host')}/sucess`,
      cancel_url: `${req.protocol}://${req.get('host')}`,
      customer_email: userData.email,
      client_reference_id: req.params.id,
      line_items: [
        {
          price_data: {
            currency: 'egp',
            unit_amount: userData.price * 100,
            product_data: {
              name: winner.item_id.name,
              description: `you are winner in auction ${winner.auction_id.name} with item ${winner.item_id.name}`,
              images: [winner.item_id.image],
            },
          },
          quantity: 1,
        },
      ],
    });

    res.status(200).json({
      status: 'success',
      session,
    });
  } catch (error) {
    next(error);
  }
};

// check if payment success or not after redirect from stripe

exports.checkPayment = async (req, res, next) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);
    if (session.payment_status === 'paid') {
      // update cardSchema for this itemDetails_id to pay true , qty minus 1 that is in itemSchema
      const query = [
        {
          $match: {
            itemDetails_id: session.client_reference_id,
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
            from: 'items',
            localField: 'itemdetails.item_id',
            foreignField: '_id',
            as: 'items',
          },
        },
        {
          $unwind: '$items',
        },
        // update qty in itemSchema and pay true in cardSchema
        {
          $set: {
            'items.qty': { $subtract: ['$items.qty', 1] },
          },
        },
        {
          $project: {
            _id: 1,
            user_id: 1,
            itemDetails_id: 1,
            price: 1,
            'items.name': 1,
            'items.image': 1,
            'itemdetails.qty': 1,
          },
        },
        // update qty in itemSchema and pay true in cardSchema
        {
          $set: {
            'itemdetails.qty': '$items.qty',
            pay: true,
          },
        },
      ];
      const itemWinner = await cardSchema.aggregate(query);
      if (itemWinner.length === 0) {
        throw new Error('No winner items');
      }
      res.status(200).json({
        status: 'success',
        message: 'payment success',
      });
    } else {
      res.status(200).json({
        status: 'success',
        message: 'payment not success',
      });
    }
  } catch (error) {
    next(error);
  }
};
