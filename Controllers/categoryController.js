const mongoose = require('mongoose');
require('../Models/categoryModel');
require('../Models/itemModel');
const categorySchema = mongoose.model('categories');
const ItemSchema = mongoose.model('items');

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
      else throw new Error('التصنيف غير موجود');
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
      if (data.matchedCount != 0)
        response.status(200).json({ message: 'تم تحديث التصنيف بنجاح' });
      else next(new Error('التصنيف غير موجود'));
    })
    .catch((error) => next(error));
};

// delete category
exports.deleteCategory = async (request, response, next) => {
  // ckech if category exist in item
  const items = await ItemSchema.findOne({ category: request.params.id });

  if (items) {
    return response.status(400).json({ error: 'التصنيف مستخدم في منتج' });
  }
  categorySchema
    .deleteOne({ _id: request.params.id })
    .then((data) => {
      if (data.deletedCount != 0)
        response.status(200).json({ message: 'تم حذف التصنيف بنجاح' });
      else throw new Error('التصنيف غير موجود');
    })
    .catch((error) => next(error));
};

// autocomplete category

exports.autocompleteCategory = (req, res, next) => {
  const name = req.params.name.trim();
  categorySchema
    .find({
      name: { $regex: name, $options: 'ix' },
    })
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      next(err);
    });
};
