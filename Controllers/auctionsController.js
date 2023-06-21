const mongoose = require('mongoose');
require('./../Models/auctionModel');
require('./../Models/itemDetailsModel');

const auctionSchema = mongoose.model('auctions');
const itemDetailsSchema = mongoose.model('itemDetails');

//Get All Auctions
exports.getAllAuctions = (request, response, next) => {
  auctionSchema
    .find({})
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};

//Get Auction By ID
exports.getAuctionById = (request, response, next) => {
  auctionSchema
    .findById(request.params.id)
    .then((data) => {
      // if there is no auction with this id
      if (!data) {
        response.status(404).json({ message: 'Auction not found' });
      } else {
        response.status(200).json({ data });
      }
    })
    .catch((error) => next(error));
};

//Add Auction
exports.addAuction = async (req, res, next) => {
  try {
    //check if all items in array are item id or not in items schema
    const auction = new auctionSchema({
      name: req.body.name,
      reference_number: req.body.reference_number,
      start_date: req.body.start_date,
      end_date: req.body.start_date,
      time: req.body.time,
      fees: req.body.fees,
    });

    const newAuction = await auction.save();
    res.status(201).json(newAuction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

//Update Auction

exports.updateAuction = (request, response, next) => {
  console.log(request.body);
  auctionSchema
    .findByIdAndUpdate(request.params.id, request.body)
    .then((data) => {
      // if there is no auction with this id
      if (data.length == 0) {
        response.status(404).json({ message: 'Auction not found' });
      } else {
        response.status(200).json({ data });
      }
    })
    .catch((error) => next(error));
};

//Delete Auction
exports.deleteAuction = async (request, response, next) => {
  // const Auctions = await itemDetailsSchema.find({ auction_id: request.params.id });
  // console.log(Auctions);
  // if (Auctions) {
  //   return response.status(400).json({ error: 'Auctions is used in itemDetails' });

  // }
  auctionSchema.findById(request.params.id).then(async (data) => {
    if (!data) {
      response.status(404).json({ message: 'Auction not found' });
    } else {
      if (data.status != 'not started') {
        response.status(400).json({ message: 'Cannot delete Started Auction ' });
      } else {
        await auctionSchema.findByIdAndDelete(request.params.id).then(async (deletedData) => {
          // Delete all item details with this auction id
          await itemDetailsSchema.deleteMany({ auction_id: deletedData._id });
          
          response.status(200).json({ message: 'Auction deleted successfully.' });
        }).catch((error) => next(error));
      }
    }
  });
  
};

//Get Auctions By Status
exports.getAuctionsByStatus = (request, response, next) => {
  console.log(request.params.status);
  auctionSchema
    .find({ status: request.params.status })
    .then((data) => {
      // if there is no auction with this status
      if (data.length == 0) {
        response.status(404).json({ message: 'Auction not found.' });
      } else {
        response.status(200).json({ data });
      }
    })
    .catch((error) => next(error));
};

//Get Auctions By Name
exports.getAuctionsByName = (request, response, next) => {
  auctionSchema.find({ name: request.params.name }).then((data) => {
    // if there is no auction with this name
    if (data.length == 0) {
      response.status(404).json({ message: 'Auction not found' });
    } else {
      response.status(200).json({ data });
    }
  });
};

// new arrival auction

exports.newArrivalAuction = (request, response, next) => {
  auctionSchema
    .find({})
    .sort({ start_date: -1 })
    .limit(3)
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
}

exports.startAuction = async (req, res) => {
  try {
    const startAuction = await auctionSchema.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: "started",
        },
        
      }
    );
    if (startAuction.matchedCount == 0)
      throw new Error('Auction not found');
    res.status(200).json({ message: 'Auction updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
exports.endAuction = async (req, res) => {
  try {
    const startAuction = await auctionSchema.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: "ended",
        },
        
      }
    );
    if (startAuction.matchedCount == 0)
      throw new Error('Auction not found');
    res.status(200).json({ message: 'Auction updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}






