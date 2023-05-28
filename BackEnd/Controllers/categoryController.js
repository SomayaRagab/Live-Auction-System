const mongoose = require('mongoose');
require('../Models/categoryModel');
const categorySchema = mongoose.model('categories');



exports.getAllCategories = (request, response, next) => {
  categorySchema
    .find({}) 
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};


// get category using param
exports.getCategory = (request, response, next) => {
  categorySchema
    .findOne({ _id: request.params.id })
    .then((data) => {
      if (data) response.status(200).json({ data });
      else throw new Error('category not found');
    })
    .catch((error) => next(error));
};


// add category
exports.addCategory = (request, response, next) => {
  new categorySchema({
    _id: request.body.id,
    name: request.body.name,
  })
    .save()
    .then((data) => {
      response.status(201).json({ data });
    })
    .catch((error) => next(error));
};



// update category
exports.updateCategory = (request, response, next) => {
    categorySchema
        .updateOne(
        { _id: request.params.id },
        {
            $set: {
            name: request.body.name,
            },
        }
        )
        .then((data) => {
        if(data.matchedCount !=0) response.status(200).json({ message: 'category updated successfully' });
        else throw new Error('category not found');
        })
        .catch((error) => next(error));
    }



   // delete category
exports.deleteCategory = (request, response, next) => {
    categorySchema
        .deleteOne({ _id: request.params.id })
        .then((data) => {
        if(data.deletedCount != 0 )response.status(200).json({  message: 'category deleted successfully' });
        else throw new Error('category not found');
        })
        .catch((error) => next(error));
    } 
