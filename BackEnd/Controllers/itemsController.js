const mongoose = require('mongoose');
require('./../Models/itemModel');
require('./../Models/categoryModel');
require('../Helper/cloudinary');
require('./../Models/itemDetailsModel');
require('./../Models/auctionModel');

const handleTempImage = require('./../Helper/uploadImage');

const cloudinary = require('cloudinary').v2;
const { extractPublicId } = require('cloudinary-build-url');
const categorySchema = mongoose.model('categories');
const ItemSchema = mongoose.model('items');
const itemDetailsSchema = mongoose.model('itemDetails');
const auctionSchema = mongoose.model('auctions');

// Get all items
exports.getAllItems = async (req, res, next) => {
  try {
    const items = await ItemSchema.find().populate({
      path: 'category',
      select: { name: 1 },
    });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get item with param

exports.getItem = (req, res, next) => {
  ItemSchema.findOne({ _id: req.params.id })
    .populate({
      path: 'category',
      select: { name: 1 },
    })
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
      console.log(category);
      if (!category) {
        return res.status(400).json({ error: 'Invalid item ID' });
      }
    }

    // Upload image to Cloudinary and get the URL
    const tempFilePath = await handleTempImage(req);
    const imageUrl = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        tempFilePath,
        { folder: 'images/item' },
        function (error, result) {
          if (error) {
            console.error(error);
            return reject('Failed to upload image to Cloudinary');
          }
          const imageUrl = result.url;
          resolve(imageUrl);
        }
      );
    });

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
    const { category } = req.body;

    // Check if all categories in array are valid item IDs in the category schema
    if (category) {
      const categoriesLength = category.length;
      for (let i = 0; i < categoriesLength; i++) {
        const item = await categorySchema.findOne({ _id: category[i] });
        if (!item) {
          return res.status(400).json({ error: 'Invalid category ID' });
        }
      }
    }


    // Upload image to Cloudinary and get the URL
    const tempFilePath = await handleTempImage(req);
    const imageUrl = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(tempFilePath, { folder: 'images/item' }, function (error, result) {
        if (error) {
          console.error(error);
          return reject('Failed to upload image to Cloudinary');
        }
        const imageUrl = result.url;
        resolve(imageUrl);
      });
    });
 
    // Update the item
    const result = await ItemSchema.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          qty: req.body.qty,
          image: imageUrl,
          material: req.body.material,
          size: req.body.size,
          color: req.body.color,
          category: category,
        },
      }
    );

    if (result.matchedCount !== 0) {
      return res.status(200).json({ message: 'Item updated successfully' });
    } else {
      throw new Error('Item not found');
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete item

exports.deleteItem = async (req, res, next) => {
  // ckech if item exist in itemDetails
  const items = await itemDetailsSchema.find({ item_id: req.params.id });
  const itemAuction = await auctionSchema.find({ item_id: req.params.id });
  if (items) {
    return res.status(400).json({ error: 'Item is used in itemDetails' });
  }
  if (itemAuction) {
    return res.status(400).json({ error: 'Item is used in auction' });
  }
  

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

// get item by category
exports.getItemsByCategory = (req, res, next) => {
  ItemSchema.find({ category: req.params.id }, { category: 0 })
    .then((data) => {
      if (data) res.status(200).json(data);
      else throw new Error('Item not found');
    })
    .catch((error) => next(error));
};

// autocomplete item name or material
exports.autocompleteItem = (req, res, next) => {
  ItemSchema.find({
    $or: [
      { name: { $regex: req.params.name, $options: 'ix' } },
      { material: { $regex: req.params.name, $options: 'ix' } },
    ],
  })
    .then((data) => {
      if (data) res.status(200).json(data);
      else throw new Error('Item not found');
    })
    .catch((error) => next(error));
};
