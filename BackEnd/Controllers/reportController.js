const mongoose = require('mongoose');
const userSchema = mongoose.model('users');
const auctionSchema = mongoose.model('auctions');
require('../Models/userModel');
require('../Models/auctionModel');

exports.getUserReport = async (request, response, next) => {
    try {
        const totalUsersCount = await userSchema.countDocuments();
        const users = await userSchema.find({});

        const reportData = {
            totalUsers: totalUsersCount,
            existingUsers: users.length,
            userData: users.map(user => ({
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address ? `${user.address.city}, ${user.address.street}, ${user.address.building_number}` : 'N/A',
                role: user.role
            }))
        };

        response.json(reportData);
        console.log('Report data sent successfully!');
    } catch (error) {
        console.log('Report Controller hit');
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



