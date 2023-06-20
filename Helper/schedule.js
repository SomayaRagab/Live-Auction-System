const schedule = require('node-schedule');
const mongoose = require('mongoose');
require('../Models/userModel');
require('../Models/joinAuctionModel');
const userSchema = mongoose.model('users');
const joinAuctionSchema = mongoose.model('joinAuctions');
const sendEmail = require('./sendEmail');

// get all user expire block and update the block and expire_block
const updateBlock = async (req, res, next) => {
  try {
    const users = await userSchema.find({ expire_block: { $gte: Date.now() } });
    for (let user of users) {
      user.block = false;
      user.expire_block = null;
      await user.save();
    }
  } catch (err) {
    next(err);
  }
};

// send email to all user before auction start_date 1 day  from joinAuction with status not started

const query = [
  {
    $lookup: {
      from: 'auctions',
      localField: 'auction_id',
      foreignField: '_id',
      as: 'auction',
    },
  },
  {
    $unwind: '$auction',
  },
  {
    $addFields: {
      'auction.start_date': {
        $dateToString: {
          format: '%Y-%m-%d',
          date: '$auction.start_date',
        },
      },
    },
  },

  // match auction start date 1 day from now
  {
    $match: {
      'auction.start_date': {
        $gte: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
          .toISOString()
          .substring(0, 10),
        $lte: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
          .toISOString()
          .substring(0, 10),
      },
      'auction.status': 'not started',
    },
  },

  {
    $lookup: {
      from: 'users',
      localField: 'user_id',
      foreignField: '_id',
      as: 'user',
    },
  },
  {
    $unwind: '$user',
  },
  {
    $project: {
      _id: 0,
      email: '$user.email',
      name: '$user.name',
      auction_name: '$auction.name',
      auction_start_date: '$auction.start_date',
    },
  },
];

// create function to remove time from date
const sendEmailBeforeAuction = async (req, res, next) => {
  try {
    const users = await joinAuctionSchema.aggregate(query);
    console.log(users);
    for (let user of users) {
    console.log(user.auction_start_date);
    // message to send arabic right to left
    const message = `<div dir="rtl"> <h3>مرحبا ${user.name},</h3>
    <p> سوف تبدأ مزاد  يسعدنا انضمامك ${user.auction_name} بتاريخ ${user.auction_start_date} </p>
    <p>تمنياتي</p>
    <p>فريق المزاد</p>
    </div>`;

    await sendEmail(user.email, ` سيبدأ المزاد الذي انضممت إليه قريبًا ${user.auction_name} `, message);
    
    }

  } catch (err) {
    next(err);
  }
};

const date = Date.now() + 5000;

// do task to send email before auction start
schedule.scheduleJob(date, sendEmailBeforeAuction);

// do task to update the user block and expire_block
schedule.scheduleJob(date, updateBlock);

// repeat schudle every day at 12:00 am
schedule.scheduleJob('0 0 0 * *', updateBlock);

// repeat schudle every day at 12:00 am
schedule.scheduleJob('0 0 0 * *', sendEmailBeforeAuction);
