const mongoose = require('mongoose');
require('../Models/itemDetailsModel');
require('../Models/cardModel');
require('../Models/itemModel');
const cardSchema = mongoose.model('cards');
const itemDetailsSchema = mongoose.model('itemDetails');
const itemSchem = mongoose.model('items');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret =
  'whsec_aefd73ff2be2786ef8ac674eced7ba671e9a903a53117bc8c6a86cf03f28b347';

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

    // create customer with email , card id
    const customer = await stripe.customers.create({
      email: userData.user_id.email,
      name: userData.user_id.name,
      metadata: {
        cardId: userData._id,
      },
    });
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
      customer: customer.id,
      mode: 'payment', // specify the payment mode at the top level
      success_url: `http://localhost:3000/payment-status/success/${userData._id}`,
      cancel_url: `http://localhost:3000/payment-status/fail/${userData._id}`,
      customer_email: userData.email,
      client_reference_id: req.params.id,
      // put card id in line_items
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
    if (req.params.status === 'success') {
      const itemWinner = await cardSchema
        .findById(req.params.id)
        .populate({ path: 'itemDetails_id', select: { item_id: 1 } });

      if (!itemWinner) {
        throw new Error('لا يوجد فائز ');
      }
      if (itemWinner.pay === true) throw new Error('تم الدفع مسبقا');

      itemWinner.pay = true;
      await itemWinner.save();

      // update qty in itemSchema and pay true in cardSchema

      const item = await itemSchem.findOneAndUpdate(
        { _id: itemWinner.itemDetails_id.item_id },
        { $inc: { qty: -1 } },
        { new: true }
      );

      res.status(200).json({ status: 'success', message: 'payment success' });
    } else if (req.params.status === 'fail') {
      res.status(200).json({ status: 'fail', message: 'payment fail' });
    }
  } catch (error) {
    next(error);
  }
};
