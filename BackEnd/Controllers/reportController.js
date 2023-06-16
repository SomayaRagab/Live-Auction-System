const mongoose = require('mongoose');
const userSchema = mongoose.model('users');
require('../Models/userModel');

exports.getReport = async (request, response, next) => {
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
