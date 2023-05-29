const mongoose = require('mongoose');
require('./../Models/itemModel');
const cloudinary = require('cloudinary').v2;
require('../Helper/cloudinary');


const ItemSchema = mongoose.model('items');

// Get all items
exports.getAllItems = async (req, res, next) => {
  try {
    const items = await ItemSchema.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get item with param

exports.getItem = (req, res, next) => {
  ItemSchema.findOne({ _id: req.params.id })
    .then((item) => {
      if (item) res.status(200).json(item);
      else throw new Error('Item not found');
    })
    .catch((error) => next(error));
};

// Add item
exports.addItem = (req, res, next) => {
  // save image url clandianry.
  image = req.file.path.replace(/\\/g, '/');
  cloudinary.uploader.upload(image, (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: 'Failed to upload image to Cloudinary' });
    }
    req.body.image = result.url;

    new ItemSchema({
      _id: req.body.id,
      name: req.body.name,
      qty: req.body.qty,
      image: req.body.image,
      material: req.body.material,
      size: req.body.size,
      color: req.body.color,
      category: req.body.category,
    })
      .save()
      .then((data) => {
        res.status(201).json({ data });
      })
      .catch((error) => next(error));
  });
};

// Update item
exports.updateItem = (req, res, next) => {
  ItemSchema.updateOne(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        qty: req.body.qty,
        image: req.body.image,
        material: req.body.material,
        size: req.body.size,
        color: req.body.color,
        category: req.body.category,
      },
    }
  )
    .then((data) => {
      if (data.matchedCount != 0)
        res.status(200).json({ message: 'Item updated successfully' });
      else throw new Error('Item not found');
    })
    .catch((error) => next(error));
};

// Delete item

exports.deleteItem = (req, res, next) => {
  ItemSchema.deleteOne({ _id: req.params.id })
    .then((data) => {
      if (data.deletedCount != 0)
        res.status(200).json({ message: 'Item deleted successfully' });
      else throw new Error('Item not found');
    })
    .catch((error) => next(error));
};
