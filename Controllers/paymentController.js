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
      .findOne({ itemDetails_id: req.params.id, user_id: req.id })
      .populate({ path: 'user_id', select: { email: 1 } });
    console.log(userData);
    if (!userData) {
      res.status(404).json({ status: 'fail', message: 'no winner found' });
    }
    const itemDetails = await itemDetailsSchema.findById(req.params.id);
    if (!itemDetails) {
      res.status(404).json({ status: 'fail', message: 'no itemDetails found' });
    }

    const winner = await itemDetailsSchema
      .findById(req.params.id)
      .populate({ path: 'auction_id', select: { name: 1 } })
      .populate({ path: 'item_id', select: { name: 1, image: 1 } });

    // create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment', // specify the payment mode at the top level
      success_url: `${req.protocol}://${req.get('host')}/success/?success=true`,
      cancel_url: `${req.protocol}://${req.get('host')}/cancel/?success=false`,
      customer_email: userData.email,
      client_reference_id: req.params.id,
      line_items: [
        {
          price_data: {
            currency: 'egp',
            unit_amount: userData.price,
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

    res.redirect(303, session.url);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'fail',
      error,
    });
  }
};
