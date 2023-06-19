const mongoose = require('mongoose');
const userSchema = mongoose.model('users');
const auctionSchema = mongoose.model('auctions');
const categorySchema = mongoose.model('categories');
const streamSchema = mongoose.model('stream');
require('../Models/userModel');
require('../Models/auctionModel');
require('../Models/categoryModel');
require('../Models/streamModel');

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
        const totalAuctionsCount = await auctionSchema.countDocuments();
        const auctions = await auctionSchema.find({});

        const reportData = {
            totalAuctions: totalAuctionsCount,
            auctionData: auctions.map(auction => ({
                name: auction.name,
                reference_number: auction.reference_number,
                start_date: auction.start_date,
                end_date: auction.end_date,
                time: auction.time,
                fees: auction.fees,
                status: auction.status
            }))
        };

        response.json(reportData);
        console.log('Auction report data sent successfully!');
    } catch (error) {
        console.log('Auction Report Controller hit');
        next(error);
    }
};

exports.getTopBiddingUsers = async (request, response, next) => {
    try {
        const topUsers = await auctionSchema.aggregate([
            {
                $group: {
                    _id: '$user',
                    totalBids: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $sort: { totalBids: -1 },
            },
            {
                $limit: 10,
            },
            {
                $project: {
                    _id: 0,
                    username: '$user.username', // Replace with the actual field containing the username in your user model
                    totalBids: 1,
                },
            },
        ]);

        response.json(topUsers);
        console.log('Top bidding users data sent successfully!');
    } catch (error) {
        console.log('Top Bidding Users Controller hit');
        next(error);
    }
};

exports.getCategoryReport = async (request, response, next) => {
    try {
        const categories = await categorySchema.aggregate([
            {
                $lookup: {
                    from: 'auctions',
                    localField: '_id',
                    foreignField: 'category',
                    as: 'auctions',
                },
            },
            {
                $match: { auctions: { $exists: true, $ne: [] } },
            },
            {
                $project: {
                    _id: 0,
                    category_id: '$_id',
                    category_name: '$name',
                    auction_count: { $size: '$auctions' },
                },
            },
            {
                $sort: { auction_count: -1 },
            },
        ]);

        response.json(categories);
        console.log('Category report data sent successfully!');
    } catch (error) {
        console.log('Category Report Controller hit');
        next(error);
    }
};

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
        console.log('Stream Report Controller hit');
        next(error);
    }
};