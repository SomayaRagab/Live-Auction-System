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
            console.log(data.image);
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
    // save image url clandianry.
    // replace \ with / in request.file.path
    console.log(request.file.path)
    image = request.file.path.replace(/\\/g, '/');
    cloudinary.uploader.upload(image, function (error, result) {
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

exports.updateUser=(request,response,next)=>{
    let password;
    if(request.body.password){
        password = bcrypt.hashSync(request.body.password, saltRounds);
    }
    if(request.role == "user"){
        userSchema.findOne({
            _id:request.body.id
        }).then((data)=>{
        if(!data){
            throw new Error("User not found");
        }
        if(request.file && data.image){
            cloudinary.v2.uploader.destroy(request.file,
                function(error,response) {
                    console.log(response, error) 
                });
        }   
        return userSchema.updateOne({//using return because use of two query actions 
            _id:request.body.id
        },{
            $set:{
                name: request.body.name,
                email: request.body.email,
                password: password,
                phone: request.body.phone,
                'address.city': request.body.city,
                'address.street': request.body.street,
                'address.building_number': request.body.building,
                image:request.file?.filename ?? undefined//if no file posted, then make mongo put undefined  
            }
        })   
    })
    .then(data=>{
        response.status(200).json({data});
    })
    .catch(error=>next(error));
    }else{
        next(new Error("not have permission, only user can edit"))
    }
}

exports.deleteUser=(request,response,next)=>{
    if(request.role == "user"){
        userSchema.findOne({
            _id:request.body.id
        }).then(data=>{
            if(!data)
                throw new Error ("Can't delete not found id ")
            if (data.image){
            fs.unlinkSync(path.join(__dirname,"..","images",`${data.image}`));
            }
            return userSchema.deleteOne({ _id: request.body.id });
        }).then (data=>{
            if(data.deletedCount>0){
                response.status(200).json({data});
            }
        }
        )
            .catch(error=>next(error));
            }else{
                next(new Error("not have permission"))
    }
}


