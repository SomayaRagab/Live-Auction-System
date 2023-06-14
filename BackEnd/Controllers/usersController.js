const mongoose = require('mongoose');
const userSchema = mongoose.model('users');
const fs = require('fs');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const saltRounds = 10;
const { extractPublicId } = require('cloudinary-build-url');
const handleTempImage = require('../Helper/uploadImage');
require('../Models/userModel');
require('../Helper/cloudinary');


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
exports.addUser = (request, response, next) => {
  // Save the image buffer as a temporary file
  const tempFilePath = handleTempImage(request);

  cloudinary.uploader.upload(tempFilePath, { folder: 'images/user' }, function (error, result) {
    if (error) {
      console.error(error);
      return response
        .status(500)
        .json({ error: 'Failed to upload image to Cloudinary' });
    }

    request.body.image = result.url;
    new userSchema({
      _id: request.body.id,
      name: request.body.name,
      email: request.body.email,
      password: bcrypt.hashSync(
        request.body.password,
        bcrypt.genSaltSync(saltRounds)
      ),
      phone: request.body.phone,
      image: request.body.image + '',
      'address.city': request.body.city,
      'address.street': request.body.street,
      'address.building_number': request.body.building,
      role: request.body.role,
    })
      .save()
      .then((data) => {
        response.status(201).json({ data });
      })
      .catch((error) => next(error));
  });
};


exports.updateUser = (request, response, next) => {
  let password;
  if (request.body.password) {
    password = bcrypt.hashSync(request.body.password, saltRounds);
  }
  // if (request.id == request.params.id) {
    userSchema
      .findOne({
        _id: request.params.id,
      })
      .then((data) => {
        if (!data) {
          throw new Error('User not found');
        }
        if (request.file && data.image) {
          const publicId = extractPublicId(data.image);
          cloudinary.uploader.destroy(publicId, function (error, result) {
            console.log(result, error);
          });
        }
        return userSchema.updateOne(
          {
            //using return because use of two query actions
            _id: request.params.id,
          },
          {
            $set: {
              name: request.body.name,
              email: request.body.email,
              password: password,
              phone: request.body.phone,
              'address.city': request.body.city,
              'address.street': request.body.street,
              'address.building_number': request.body.building,
              image: request.file?.filename ?? undefined, //if no file posted, then make mongo put undefined
            },
          }
        );
      })
      .then((data) => {
        response.status(200).json({ data: 'user updated successfully' });
      })
      .catch((error) => next(error));
  // } else {
  //   next(new Error('not have permission'));
  // }
};

exports.deleteUser = (request, response, next) => {
    userSchema
    .findOne({
      _id: request.params.id,
    })
    .then((data) => {
      if (!data) throw new Error("Can't delete not found id ");
      if (data.image) {
        const publicId = extractPublicId(data.image);
        cloudinary.uploader.destroy(publicId, function (error, result) {
        });
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

exports.blockOrUnblockUser = (request,response, next) => {
  let block= true;
  userSchema
    .findOne({
      _id: request.params.id,
    })
    .then((data) => {
      if (!data) throw new Error("there is no user with this id ");
      if(data.block == false){
        data.block = true;
        data.expire_block =addMonthToDate()
        block = true
      }
      else
        {
          data.block = false;
          data.expire_block=null
          block = false
        }
      return userSchema.updateOne(
        {
          _id: request.params.id,
        },
        {
          $set: {
            block: data.block,
            expire_block: data.expire_block
          },
        }
      );
    })
    .then((data) => {
      response.status(200).json({ data: `user updated successfully, block=${block}` });
    })
    .catch((error) => next(error));
};

// function to add to expiredate mounth

function addMonthToDate() {
  currentDate = new Date();
  const futureDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
  return futureDate;
}


