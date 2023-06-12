const schedule = require('node-schedule');
const mongoose = require('mongoose');
require('../Models/userModel');
const userSchem =mongoose.model('users');

const updateBlock =async(req , res , next)=> {
    try {
      const users = await userSchem.find({ expire_block: { $gte: Date.now() } });
      for (let user of users) {
        user.block = false;
        user.expire_block = null;
        await user.save();
      }
    } catch (err) {
     next(err);
    }
  }



const date = Date.now() + 5000;


// do task to update the user block and expire_block
schedule.scheduleJob(date, updateBlock);
 

// repeat schudle every day at 12:00 am
schedule.scheduleJob('0 0 0 * *', updateBlock);





