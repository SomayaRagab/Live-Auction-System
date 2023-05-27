const mongoose = require('mongoose');
const fs = require('fs');
const clandinary = require('cloudinary').v2;
require('../Models/userModel');
const userSchema = mongoose.model('users');

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

    // save image url clandianry
    clandinary.uploader.upload(request.file.path, function (error, result) {
        request.body.image = result.url;
    });
    new userSchema({
        _id: request.body.id,
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
        phone: request.body.phone,
        image: request.body.image,
        "address.city": request.body.city,
        "address.street": request.body.street,
        "address.building": request.body.building,
        role: request.body.role

    })
        .save()
        .then((data) => {
            response.status(201).json({ data });
        })
        .catch((error) => next(error));
};