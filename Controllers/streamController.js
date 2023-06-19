const mongoose = require('mongoose');
require('./../Models/streamModel');
const streamSchema = mongoose.model('stream');



//get all streams
exports.getAllStreams = (request, response, next) => {
    streamSchema
        .find({})
        .then((data) => {
            response.status(200).json({ data });
        })
        .catch((error) => next(error));
};


//get stream using params

exports.getStreamById = (request, response, next) => {
    streamSchema
        .findById(request.params.id)
        .then((data) => {
            // if there is no stream with this id
            if (!data) {
                response.status(404).json({ message: 'Stream not found' });
            } else {
                response.status(200).json({ data });
            }
        })
        .catch((error) => next(error));
}


//delete a stream
exports.deleteStream = (request, response, next) => {
    streamSchema
        .findByIdAndDelete(request.params.id)
        .then((data) => {
            // if there is no stream with this id
            if (!data) {
                response.status(404).json({ message: 'Stream not found' });
            } else {
                response.status(200).json({ message: 'Stream deleted successfully' });
            }
        })
        .catch((error) => next(error));
};


//add stream 
exports.addStream = (request, response, next) => {
    new streamSchema({
        _id: request.body.id,
        title: request.body.title,
        description: request.body.description,
        link: request.body.link,
        auction_id: request.body.auction_id,
    })
        .save()
        .then((data) => {
            response.status(201).json({ data });
        })
        .catch((error) => next(error));
}


//update stream status
exports.updateStreamStatus = (request, response, next) => {
    streamSchema
        .findByIdAndUpdate(request.params.id, { status: request.body.status })
        .then((data) => {
            // if there is no stream with this id
            if (!data) {
                response.status(404).json({ message: 'Stream not found' });
            } else {
                response.status(200).json({ message: 'Stream status updated successfully' });
            }
        })
        .catch((error) => next(error));
};


//get stream for specific auction 
exports.getStreamByAuctionId = (request, response, next) => {
    streamSchema
        .find({ auction_id: request.params.id })
        .then((data) => {
            // if there is no stream with this id
            if (!data) {
                response.status(404).json({ message: 'Stream not found' });
            } else {
                response.status(200).json({ data });
            }
        })
        .catch((error) => next(error));
};

//change stream status to active
exports.changeStreamStatus = (request, response, next) => {
    streamSchema
        .updateOne({ _id: request.params.id }, { status: 'active' })
        .then((data) => {
            // if there is no stream with this id
            if (!data) {
                response.status(404).json({ message: 'Stream not found' });
            } else {
                response.status(200).json({ message: 'Stream status updated successfully' });
            }
        })
        .catch((error) => next(error));
} 
