const mongoose = require('mongoose');
require('../Models/bindingModel');
require('../Models/itemDetailsModel');
const bindingSchema = mongoose.model('biddings');
const itemDetailsSchema = mongoose.model('itemDetails');
const userSchema = mongoose.model('users');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res, next) => {
  try {
    const itemDetails = await itemDetailsSchema
      .findOne(
        {
          _id: req.params.id,
        },
        { item_id: 1, auction_id: 1 }
      )
      .populate({ path: 'item_id', select: { name: 1, image: 1 } })
      .populate({ path: 'auction_id', select: { name: 1 } });
    if (!itemDetails) {
      res.status(400).json({ success: false, error: 'Invalid item ID' });
      return;
    }

    // get max amount for item in auction
    const winner = await bindingSchema
      .findOne(
        {
          itemDetails_id: req.params.id,
        },
        {
          user_id: 1,
          amount: 1,
        }
      )
      .populate({ path: 'user_id', select: { email: 1 , name:1 } })
      .sort({ amount: -1 })
      .limit(1)
      .then((data) => {
        return data;
      });

    if (!winner) {
      res.status(400).json({ success: false, error: 'no winner' });
      return;
    }

    // get user id
    const user = await userSchema.findOne({ _id: req.id });

    // create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment', // specify the payment mode at the top level
      success_url: `${req.protocol}://${req.get('host')}/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
      customer_email: winner.user_id.email,
      client_reference_id: req.params.id,
      line_items: [
        {
          price_data: {
            currency: 'egp',
            unit_amount: winner.amount * 100,
            product_data: {
              name: itemDetails.item_id.name,
              description: `item ${itemDetails.auction_id.name} in auction`,
              images: [itemDetails.item_id.image],
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
    console.log(error);
    res.status(500).json({
      status: 'fail',
      error,
    });
  }
};
