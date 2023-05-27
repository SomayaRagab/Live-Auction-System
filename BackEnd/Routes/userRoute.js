const express = require('express');
const controller = require('./../Controllers/usersController');
const validateMW = require('./../Validations/validateMW');
const { validatePostArray } = require('./../Validations/userValidationArray');
const uploadImage = require('../Helper/uploadingImages');
const imageUpload = uploadImage('user');

const router = express.Router();

router
    .route('/users')
    .get( controller.getAllUsers)
    .post(imageUpload.single('image'),controller.addUser);


module.exports = router;