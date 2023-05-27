require('../Models/userModel');
const mongoose = require('mongoose');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
 require('../Helper/cloudinary');
const userSchema = mongoose.model('users');
const bcrypt = require('bcrypt');
const saltRounds = 10;


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

    cloudinary.config({
        cloud_name: 'devnekpsn',
        api_key: '716982735537538',
        api_secret: 'DobujUPSTN5VO6Gjk8O4QoL0ZkI'
      });


    // save image url clandianry.
    // replace \ with / in request.file.path

    image = request.file.path.replace(/\\/g, '/');
    console.log(request.file.path);
    const path = `./../${image}`;
    cloudinary.uploader.upload(image, function (error, result) {
        //this will the image source
        // console.log(result);
        if (error) {
            console.error(error);
            return response.status(500).json({ error: 'Failed to upload image to Cloudinary' });
          }
      
          request.body.image = result.url;
          console.log(request.body.image);
      
        // request.body.image = result.url;
    });


    // console.log(request.body.image);
    // new userSchema({
    //     _id: request.body.id,
    //     name: request.body.name,
    //     email: request.body.email,
    //     password: bcrypt.hashSync(request.body.password, bcrypt.genSaltSync(saltRounds)),
    //     phone: request.body.phone,
    //     image: request.body.image,
    //     "address.city": request.body.city,
    //     "address.street": request.body.street,
    //     "address.building_number": request.body.building,
    //     role: request.body.role

    // })
    //     .save()
    //     .then((data) => {
    //         response.status(201).json({ data });
    //     })
    //     .catch((error) => next(error));
};
