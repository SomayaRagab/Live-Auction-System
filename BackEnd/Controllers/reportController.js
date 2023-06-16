const mongoose = require('mongoose');
const userSchema = mongoose.model('users');
const auctionSchema = mongoose.model('auctions');
require('../Models/userModel');

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



