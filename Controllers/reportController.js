const mongoose = require('mongoose');
const moment = require('moment');
const userSchema = mongoose.model('users');
const auctionSchema = mongoose.model('auctions');
const categorySchema = mongoose.model('categories');
const streamSchema = mongoose.model('stream');
const itemsSchema = mongoose.model('items');
require('../Models/userModel');
require('../Models/auctionModel');
require('../Models/categoryModel');
require('../Models/streamModel');
require('../Models/itemModel');

exports.getUserReport = async (request, response, next) => {
    try {
        const totalUsersCount = await userSchema.countDocuments();
        const users = await userSchema.find({});

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        const startDate = new Date(currentYear, currentMonth, 1); // Start of the current month
        const endDate = new Date(currentYear, currentMonth + 1, 0); // End of the current month

        const usersJoinedThisMonthCount = await userSchema.countDocuments({
            createdAt: { $gte: startDate, $lt: endDate }
        });

        const previousMonthStartDate = new Date(currentYear, currentMonth - 1, 1); // Start of the previous month
        const previousMonthEndDate = new Date(currentYear, currentMonth, 0); // End of the previous month

        const usersJoinedPreviousMonthCount = await userSchema.countDocuments({
            createdAt: { $gte: previousMonthStartDate, $lt: previousMonthEndDate }
        });

        const usersIncreased = usersJoinedThisMonthCount > usersJoinedPreviousMonthCount;
        const usersDecreased = usersJoinedThisMonthCount < usersJoinedPreviousMonthCount;

        const reportData = {
            totalUsers: totalUsersCount,
            existingUsers: users.length,
            usersJoinedThisMonth: usersJoinedThisMonthCount,
            usersJoinedPreviousMonth: usersJoinedPreviousMonthCount,
            usersIncreased,
            usersDecreased,
            userData: users.map(user => ({
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address ? `${user.address.city}, ${user.address.street}, ${user.address.building_number}` : 'N/A',
                role: user.role
            }))
        };

        response.json(reportData);
        console.log('User report data sent successfully!');
    } catch (error) {
        console.log('User Report Controller hit');
        next(error);
    }
};

exports.getAuctionReport = async (request, response, next) => {
    try {
        const currentYear = moment().year();
        const currentMonth = moment().month() + 1;
    
        const pipeline = [
          {
            $match: {
              start_date: {
                $gte: moment().startOf('year').toDate(),
                $lte: moment().endOf('year').toDate()
              }
            }
          },
          {
            $group: {
              _id: { $month: '$start_date' },
              count: { $sum: 1 }
            }
          },
          {
            $sort: { _id: 1 }
          }
        ];
    
        const auctionCounts = await auctionSchema.aggregate(pipeline);
    
        const result = {};
    
        auctionCounts.forEach(auction => {
          const month = auction._id;
          const count = auction.count;
    
          result[month] = count;
        });
    
        const currentMonthCount = result[currentMonth] || 0;
    
        response.json({
          currentMonthCount,
          monthlyCounts: result
        });
      } catch (error) {
        response.status(500).json({ error: error.message });
      }
    }

// exports.getTopBiddingUsers = async (request, response, next) => {
//     try {
//         const topUsers = await auctionSchema.aggregate([
//             {
//                 $group: {
//                     _id: '$user',
//                     totalBids: { $sum: 1 },
//                 },
//             },
//             {
//                 $lookup: {
//                     from: 'users',
//                     localField: '_id',
//                     foreignField: '_id',
//                     as: 'user',
//                 },
//             },
//             {
//                 $unwind: '$user',
//             },
//             {
//                 $sort: { totalBids: -1 },
//             },
//             {
//                 $limit: 10,
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     username: '$user.username', // Replace with the actual field containing the username in your user model
//                     totalBids: 1,
//                 },
//             },
//         ]);

//         response.json(topUsers);
//         console.log('Top bidding users data sent successfully!');
//     } catch (error) {
//         console.log('Top Bidding Users Controller hit');
//         next(error);
//     }
// };

exports.getCategoryReport = async (request, response, next) => {
    try {
        const categoryCounts = await itemsSchema.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $project: {
                    _id: 0,
                    categoryName: { $arrayElemAt: ['$category.name', 0] },
                    count: 1
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 1
            }
        ]);
        if (categoryCounts.length > 0) {
            const mostUsedCategory = categoryCounts[0];
            response.json({ 'Most used category:': mostUsedCategory.categoryName, 'Count:': mostUsedCategory.count });
        } else 
            response.json('No items found.');
    } catch (error) {
        next(error);
    }
}

exports.getStreamReport = async (request, response, next) => {
    try {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        const startDate = new Date(currentYear, currentMonth, 1); // Start of the current month
        const endDate = new Date(currentYear, currentMonth + 1, 0); // End of the current month

        const streamsCount = await streamSchema.countDocuments({
            createdAt: { $gte: startDate, $lt: endDate },
        });

        response.json({ streamsCount });
        console.log('Stream report data sent successfully!');
    } catch (error) {
        next(error);
    }
};