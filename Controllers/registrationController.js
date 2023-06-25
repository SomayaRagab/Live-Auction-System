require('../Models/userModel');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
require('../Helper/cloudinary');
const userSchema = mongoose.model('users');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//add user
exports.addUser = (request, response, next) => {
    // save image url clandianry.
    // replace \ with / in request.file.path
    image = request.file.path.replace(/\\/g, '/');
    cloudinary.uploader.upload(image, function (error, result) {
        if (error) {
            console.error(error);
            return response
                .status(500)
                .json({ error: 'فشل تحميل الصوره الي cloudinary ' });
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
            role: 'user',
        })
            .save()
            .then((data) => {
                response.status(201).json({ data });
            })
            .catch((error) => next(error));
    });
};