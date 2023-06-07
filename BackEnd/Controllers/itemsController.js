const mongoose = require('mongoose');
require('./../Models/itemModel');
require('./../Models/categoryModel');
const cloudinary = require('cloudinary').v2;
require('../Helper/cloudinary');
const { extractPublicId } = require('cloudinary-build-url');

const categorySchema = mongoose.model('categories');
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

exports.addItem = async (req, res, next) => {
  try {
    // Check if all items in array are valid item IDs in the category schema
    const categories = req.body.category;
    const categoriesLength = categories.length;
    for (let i = 0; i < categoriesLength; i++) {
      const category = await categorySchema.findOne({ _id: categories[i] });
      if (!category) {
        return res.status(400).json({ error: 'Invalid item ID' });
      }
    }

    // Upload image to Cloudinary and get the URL
    const image = req.file.path.replace(/\\/g, '/');
    const cloudinaryResult = await cloudinary.uploader.upload(image);
    const imageUrl = cloudinaryResult.url;

    // Create and save the new item
    const newItem = new ItemSchema({
      _id: req.body.id,
      name: req.body.name,
      qty: req.body.qty,
      image: imageUrl,
      material: req.body.material,
      size: req.body.size,
      color: req.body.color,
      category: categories,
    });
    const savedItem = await newItem.save();
    return res.status(201).json({ data: savedItem });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Update item
exports.updateItem = async (req, res, next) => {
  try {
    const { category, name, qty, material, size, color } = req.body;

    // Check if all categories in array are valid item IDs in the category schema
    const categories = req.body.category;
    if (category) {
      const categoriesLength = categories.length;
      for (let i = 0; i < categoriesLength; i++) {
        const category = await categorySchema.findOne({ _id: categories[i] });
        if (!category) {
          return res.status(400).json({ error: 'Invalid item ID' });
        }
      }
    }

    // Upload image to Cloudinary and get the URL
    let imageUrl = '';
    console.log(req.file);
    if (req.file) {
      const image = req.file.path.replace(/\\/g, '/');
      const cloudinaryResult = await cloudinary.uploader.upload(image);
      imageUrl = cloudinaryResult.url;
    }
    // Update the item
    const result = await ItemSchema.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name,
          qty,
          image: imageUrl,
          material,
          size,
          color,
          category,
        },
      }
    );

    if (result.matchedCount !== 0) {
      return res.status(200).json({ message: 'Item updated successfully' });
    } else {
      throw new Error('Item not found');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Delete item

exports.deleteItem = async (req, res, next) => {
  const image = await ItemSchema.find(
    { _id: req.params.id },
    { image: 1, _id: 0 }
  );

  if (image) {
    const public_id = extractPublicId(image[0].image);
    cloudinary.uploader.destroy(public_id, function (error, result) {
      if (error) throw new Error('error cloudinary');
    });
  }

  ItemSchema.deleteOne({ _id: req.params.id })
    .then((data) => {
      if (data.deletedCount != 0)
        res.status(200).json({ message: 'Item deleted successfully' });
      else throw new Error('Item not found');
    })
    .catch((error) => next(error));
};
