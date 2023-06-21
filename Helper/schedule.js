const schedule = require('node-schedule');
const mongoose = require('mongoose');
require('../Models/userModel');
require('../Models/joinAuctionModel');
require('../Models/auctionModel');
const userSchema = mongoose.model('users');
const joinAuctionSchema = mongoose.model('joinAuctions');
const auctionSchema = mongoose.model('auctions');
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

//query get all user before auction start_date 1 day  from joinAuction with status not started

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

// query  get all auction before auction start_date 1 day  from auctionSchema with status not started

const queryAdmin = [
  {
    $addFields: {
      start_date: {
        $dateToString: {
          format: '%Y-%m-%d',
          date: '$start_date',
        },
      },
    },
  },
  {
    $match: {
      start_date: {
        $gte: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
          .toISOString()
          .substring(0, 10),
        $lte: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
          .toISOString()
          .substring(0, 10),
      },
      status: 'not started',
    },
  },
  {
    $project: {
      _id: 0,
      name: '$name',
      auction_start_date: '$start_date',
    },
  },
];

// create function to send email to admin before auction start
const sendEmailBeforeAuctionAdmin = async (req, res, next) => {
  try {
    const auctions = await auctionSchema.aggregate(queryAdmin);
    for (let auction of auctions) {
      const message = `<div dir="rtl"> <h3>  مرحبا م/ سميه,</h3>
    <p> سوف يبدأ مزاد بعد 24 ساعه  ${auction.name} بتاريخ ${auction.auction_start_date} </p>
    <p>تمنياتي</p>
    <p>فريق المزاد</p>
    </div>`;

      await sendEmail(
        `somayaragab22@gmail.com`,
        ` سيبدأ مزاد ${auction.name}  قريبًا  `,
        message
      );
    }
  } catch (err) {
    next(err);
  }
};

// create function to remove time from date
const sendEmailBeforeAuction = async (req, res, next) => {
  try {
    const users = await joinAuctionSchema.aggregate(query);
    for (let user of users) {
      // message to send arabic right to left
      const message = `<div dir="rtl"> <h3>مرحبا ${user.name},</h3>
    <p> سوف تبدأ مزاد  يسعدنا انضمامك ${user.auction_name} بتاريخ ${user.auction_start_date} </p>
    <p>تمنياتي</p>
    <p>فريق المزاد</p>
    </div>`;

      await sendEmail(
        user.email,
        ` سيبدأ المزاد الذي انضممت إليه قريبًا ${user.auction_name} `,
        message
      );
    }
  } catch (err) {
    next(err);
  }
};

const date = Date.now() + 5000;
// do task to send email to admin before auction start
// schedule.scheduleJob(date, sendEmailBeforeAuctionAdmin);

// do task to send email before auction start
// schedule.scheduleJob(date, sendEmailBeforeAuction);

// do task to update the user block and expire_block
schedule.scheduleJob(date, updateBlock);

// repeat schudle every day at 12:00 am
schedule.scheduleJob('0 0 0 * *', updateBlock);

// repeat schudle every day at 12:00 am
schedule.scheduleJob('0 0 0 * *', sendEmailBeforeAuction);

// repeat schudle every day at 12:00 am
schedule.scheduleJob('0 0 0 * *', sendEmailBeforeAuctionAdmin);
