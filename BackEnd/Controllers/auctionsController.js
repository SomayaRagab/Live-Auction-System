const mongoose = require("mongoose");
require("./../Models/auctionModel");


const auctionSchema = mongoose.model("auctions");


//Get All Auctions 
exports.getAllAuctions = (request,response,error) =>{
    auctionSchema.find({})
    .then((data) => {
        response.status(200).json({ data });
      })
      .catch((error) => next(error));
};

//Get Auction By ID
exports.getAuctionById = (request,response,error) =>{
    auctionSchema.findById(request.params.id)
    .then((data) => {
        // if there is no auction with this id
        if(data.length == 0){
            response.status(404).json({ message: "Auction not found" });
        }
        else{
        response.status(200).json({ data });
        }
      })
      .catch((error) => next(error));
}


//Add Auction

// note about items and users ids
exports.addAuction = async (request,response,error) =>{
    try {
        const auction = new auction({
          name: req.body.name,
          reference_number: req.body.reference_number,
          start_date: req.body.start_date,
          end_date: req.body.end_date,
          time: req.body.time,
          fees: req.body.fees,
          status: req.body.status,
          items: req.body.items
        });
    
        const newAuction = await auction.save();
        res.status(201).json(newAuction);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
      }
}

//Update Auction

exports.updateAuction = (request,response,error) =>{
    auctionSchema.findByIdAndUpdate(request.params.id, request.body)
    .then((data) => {
        // if there is no auction with this id
        if(data.length == 0){
            response.status(404).json({ message: "Auction not found" });
        }
        else{
        response.status(200).json({ data });
        }
      })
      .catch((error) => next(error));
}


//Delete Auction
exports.deleteAuction = (request,response,error) =>{
    auctionSchema.findByIdAndDelete(request.params.id)
    .then((data) => {
        // if there is no auction with this id
        if(data.length == 0){
            response.status(404).json({ message: "Auction not found" });
        }
        else{
        response.status(200).json({ data });
        }
      })
      .catch((error) => next(error));
}





