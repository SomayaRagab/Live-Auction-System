const mongoose = require('mongoose');
require('./../Models/auctionModel');
require('./../Models/itemDetailsModel');
require('./../Models/joinAuctionModel');
const {addTimeToDate} = require('./../Helper/calculateDate')

const auctionSchema = mongoose.model('auctions');
const itemDetailsSchema = mongoose.model('itemDetails');
const joinAuctionSchema = mongoose.model('joinAuctions');

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
        response.status(404).json({ message: 'هذاالمزاد غير متوفر' });
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
      start_date: addTimeToDate(req.body.start_date,req.body.time),
      end_date:addTimeToDate(req.body.start_date,req.body.time),
      fees: req.body.fees,
    });

    const newAuction = await auction.save();
    res.status(201).json(newAuction);
  } catch (err) {

    res.status(500).json({ error: err.message });
  }
};

//Update Auction

exports.updateAuction = (request, response, next) => {
  auctionSchema
    .findByIdAndUpdate(request.params.id, request.body)
    .then((data) => {
      // if there is no auction with this id
      if (data.length == 0) {
        response.status(404).json({ message: 'هذا المزاد غير متوفر' });
      } else {
        if(data.status != 'not started'){
          response.status(400).json({ message: ' لا يمكن تعديل المزاد عند البدء المزاد او انتهائه' });
        }else{
          response.status(200).json({ message: 'تم تعديل المزاد بنجاح' });
        }
      }
    })
    .catch((error) => next(error));
};

//Delete Auction
exports.deleteAuction = async (request, response, next) => {
  auctionSchema.findById(request.params.id).then(async (data) => {
    if (!data) {
      response.status(404).json({ message: 'هذا المزاد غير متوفر' });
    } else {
      if (data.status != 'not started') {
        response.status(400).json({ message: ' لا يمكن مسح المزاد بعد البدء به ' });
      } else {
        await auctionSchema.findByIdAndDelete(request.params.id).then(async (deletedData) => {
          // Delete all item details with this auction id
          await itemDetailsSchema.deleteMany({ auction_id: deletedData._id });
          
          response.status(200).json({ message: 'تم مسح المزاد بنجاح' });
        }).catch((error) => next(error));
      }
    }
  });
  
};

//Get Auctions By Status
exports.getAuctionsByStatus = (request, response, next) => {
  auctionSchema
    .find({ status: request.params.status })
    .then((data) => {
      // if there is no auction with this status
      if (data.length == 0) {
        response.status(404).json({ message: 'هذا المزاد غير متوفر' });
      } else {
        response.status(200).json({ data });
      }
    })
    .catch((error) => next(error));
};

exports.userAuctions = async(request, response, next) => {
  const userId = request.id;
  const startedAuction = await auctionSchema.find({ status: "started" });
  joinAuctionSchema.find({ user_id: userId, auction_id: startedAuction})
.then((data) => {
  if (data.length === 0) {
    response.status(404).json({ message: 'لم تشترك في هذا لمزاد' });
  }
  else{
    response.status(200).json({ data });
  }
})
.catch((error) => next(error));
};



//Get Auctions By Name
exports.getAuctionsByName = (request, response, next) => {
  auctionSchema.find({
   
       name: { $regex: request.params.name, $options: 'ix' } ,
     
   
  }).then((data) => {
    // if there is no auction with this name
    if (data.length == 0) {
      response.status(404).json({ message: 'هذا المزاد غير متوفر' });
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
    //find auctions with status started 
    const auction = await auctionSchema.find({ status: 'started' });
    //if there is auction with status started return you can't start miiore than one auction at the same time
    if (auction.length != 0) {
      throw new Error('لا يمكن بدأ اكتر من مزاد في نفس التوقيت');
    }
    //if there is no auction with status started update auction status to started
    else{
      const startAuction = await auctionSchema.updateOne(
        { _id: req.params.id },
        {
          $set: {
            status: "started",
          },
          
        }
      );
      if (startAuction.matchedCount == 0)
        throw new Error('هذا المزاد غير متوفر');
      res.status(200).json({ message: 'تم تعديل المزاد بنجاح' });
    }
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
      throw new Error('هذا المزاد غير متوفر');
    res.status(200).json({ message: 'تم تعديل المزاد بنجاح' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}






