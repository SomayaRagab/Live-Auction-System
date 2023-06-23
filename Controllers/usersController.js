const mongoose = require('mongoose');
require('../Models/userModel');
require('../Models/auctionModel');
require('../Helper/cloudinary');
const userSchema = mongoose.model('users');
const auctionSchema = mongoose.model('auctions');
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { tr } = require('date-fns/locale');

const handleTempImage = require('./../Helper/uploadImage');
const cloudinary = require('cloudinary').v2;
const { extractPublicId } = require('cloudinary-build-url');

//get all users in system
exports.getAllUsers = async (request, response, next) => {
  const users = await userSchema
    .find({})
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};

//get user using param
exports.getUser = (request, response, next) => {
  userSchema
    .findOne({ _id: request.params.id })
    .then((data) => {
      if (data) response.status(200).json({ data });
      else throw new Error('user not found');
    })
    .catch((error) => next(error));
};

//add user
exports.addUser = async (request, response, next) => {
  try {
    // Upload image to Cloudinary and get the URL
    const tempFilePath = await handleTempImage(request);
    const imageUrl = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        tempFilePath,
        { folder: 'images/user' },
        function (error, result) {
          if (error) {
            return reject('Failed to upload image to Cloudinary');
          }
          const imageUrl = result.url;
          resolve(imageUrl);
        }
      );
    });

    const user = new userSchema({
      _id: request.body.id,
      name: request.body.name,
      email: request.body.email,
      password: bcrypt.hashSync(
        request.body.password,
        bcrypt.genSaltSync(saltRounds)
      ),
      phone: request.body.phone,
      image: imageUrl,
      'address.city': request.body.city,
      'address.street': request.body.street,
      'address.building_number': request.body.building,
      role: request.body.role,
    });
    const savedItem = await user.save();
    response.status(201).json({ data: savedItem });
  } catch (error) {
    next(error);
  }
};

//update user

exports.updateUser = async (request, response, next) => {
  try {
    if (request.id != request.params.id) {
      throw new Error('not have permission');
    }

    const user = await userSchema.findOne({ _id: request.params.id });
    if (!user) {
      throw new Error('User not found');
    }

    let url = user.image;
    if (request.file) {
      const publicId = extractPublicId(user.image);

      cloudinary.uploader.destroy(publicId, function (error, result) {
        if (error) console.log('error in delete image from cloudinary');
      });
      // Upload image to Cloudinary and get the URL
      const tempFilePath = await handleTempImage(request);
      const imageUrl = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          tempFilePath,
          { folder: 'images/user' },
          function (error, result) {
            if (error) {
              return reject('Failed to upload image to Cloudinary');
            }
            const imageUrl = result.url;
            resolve(imageUrl);
          }
        );
      });
      url = imageUrl;
    }
 // update user
    const updatedUser = await userSchema.updateOne(
      { _id: request.params.id },
      {
        $set: {
          name: request.body.name,
          phone: request.body.phone,
          image: url,
          'address.city': request.body.city,
          'address.street': request.body.street,
          'address.building_number': request.body.building,
          role: request.body.role,
        },
      }
    );


    response.status(200).json({ data: 'user updated successfully' });
  } catch (error) {
    next(error);
  }
};

//delete user
exports.deleteUser = (request, response, next) => {
  userSchema
    .findOne({
      _id: request.params.id,
    })
    .then((data) => {
      if (!data) throw new Error("Can't delete not found id ");
      if (data.image) {
        const publicId = extractPublicId(data.image);
        cloudinary.uploader.destroy(publicId, function (error, result) {});
      }
      return userSchema.deleteOne({ _id: request.params.id });
    })
    .then((data) => {
      if (data.deletedCount > 0) {
        response.status(200).json({ data: 'user deleted successfully' });
      }
    })
    .catch((error) => next(error));
};

exports.blockOrUnblockUser = (request, response, next) => {
  let block = true;
  userSchema
    .findOne({
      _id: request.params.id,
    })
    .then((data) => {
      if (!data) throw new Error('there is no user with this id ');
      if (data.block == false) {
        data.block = true;
        data.expire_block = addMonthToDate();
        block = true;
      } else {
        data.block = false;
        data.expire_block = null;
        block = false;
      }
      return userSchema.updateOne(
        {
          _id: request.params.id,
        },
        {
          $set: {
            block: data.block,
            expire_block: data.expire_block,
          },
        }
      );
    })
    .then((data) => {
      response
        .status(200)
        .json({ data: `user updated successfully, block=${block}` });
    })
    .catch((error) => next(error));
};

// function to add to expiredate mounth

function addMonthToDate() {
  currentDate = new Date();
  const futureDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    currentDate.getDate()
  );
  return futureDate;
}

// join user for auction

// exports.joinUserForAuction = async (request, response, next) => {
//   try {
//     const auction = await auctionSchema.findById(request.params.id);
//     if (!auction) {
//       throw new Error('Auction not found');
//     } else {
//       if (auction.status == 'ended'  ) {
//         const auctions = await userSchema.findByIdAndUpdate(
//           request.id,
//           { $push: { join_auctions:request.params.id } },
//           { new: true }
//         );
//         response.status(200).json('auction joined updated successfully');
//       } else {
//           throw new Error('Cannot join auction after start');
//       }
//     }
//   } catch (err) {
//     next(err);
//   }
// }
