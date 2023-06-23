const mongoose = require('mongoose');
const moment = require('moment');
const userSchema = mongoose.model('users');
const auctionSchema = mongoose.model('auctions');
const categorySchema = mongoose.model('categories');
// const streamSchema = mongoose.model('stream');
const itemsSchema = mongoose.model('items');
const cardsSchema = mongoose.model('cards');
const joinAuctionSchema = mongoose.model('joinAuctions');
require('../Models/userModel');
require('../Models/auctionModel');
require('../Models/categoryModel');
require('../Models/streamModel');
require('../Models/itemModel');
require('../Models/cardModel');
require('../Models/joinAuctionModel');

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

exports.getProfitReport = async (request, response, next) => {
    try {
        const pipeline = [
            {
                $match: {
                    createdAt: {
                        $gte: moment().startOf('year').toDate(),
                        $lte: moment().endOf('year').toDate()
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    totalRevenue: { $sum: '$price' }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ];
        const revenueReport = await cardsSchema.aggregate(pipeline);
        const result = {};
        revenueReport.forEach(report => {
            const month = report._id;
            const totalRevenue = report.totalRevenue;
            result[month] = totalRevenue;
        });
        response.json(result);
    } catch (error) {
        next(error);
    }
}

exports.getTop10Users = async (request, response, next) => {
    try {
        const topUsers = await joinAuctionSchema.aggregate([
            { $group: { _id: '$user_id', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);

        const userIDs = topUsers.map((user) => user._id);

        const users = await userSchema.find({ _id: { $in: userIDs } });

        const report = users.map((user) => {
            const count = topUsers.find((u) => u._id.toString() === user._id.toString()).count;
            return { username: user.name, joinCount: count };
        });

        response.json(report);
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: 'Internal Server Error' });
    }
}
