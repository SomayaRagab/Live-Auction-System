const mongoose = require('mongoose');
require('../Models/bindingModel');
require('../Models/itemDetailsModel');
const bindingSchema = mongoose.model('biddings');
const itemDetailsSchema = mongoose.model('itemDetails');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = async (req, res, next) => {
  try {
    const itemDetails = await itemDetailsSchema
      .findOne(
        {
          item_id: req.params.id,
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
    const max_price = await bindingSchema
      .find({
        itemDetails_id: req.params.id,
      })
      .sort({ amount: -1 })
      .limit(1)
      .then((data) => {
        return data[0].amount;
      });

    // create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${req.protocol}://${req.get('host')}/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
      customer_email: req.user.email,
      client_reference_id: req.params.id,
      line_items: [
        {
          name: itemDetails.item_id.name,
          description: `item ${itemDetails.auction_id.name}in auction`,
          images: [itemDetails.item_id.image],
          amount: max_price * 100,
          currency: 'egp',
          quantity: 1,
        },
      ],
    });
    res.status(200).json({
      status: 'success',
      session,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      error,
    });
  }
};
