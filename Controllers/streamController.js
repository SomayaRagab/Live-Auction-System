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
                response.status(404).json({ message: 'البث لم يتم العثور عليه' });
            } else {
                response.status(200).json({ data });
            }
        })
        .catch((error) => next(error));
}

//get stream using status
exports.getActiveStream = (request, response, next) => {
    streamSchema
        .find({ status: "active" })
        .then((data) => {
            // if there is no stream with this status
            if (data.length == 0) {
                response.status(404).json({ message: 'البث لم يتم العثور عليه.' });
            } else {
                response.status(200).json({ data });
            }
        })
        .catch((error) => next(error));
};


//delete a stream
exports.deleteStream = (request, response, next) => {
    streamSchema
        .findByIdAndDelete(request.params.id)
        .then((data) => {
            // if there is no stream with this id
            if (!data) {
                response.status(404).json({ message: 'البث لم يتم العثور عليه' });
            } else {
                response.status(200).json({ message: 'تم حذف البث بنجاح' });
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
                response.status(404).json({ message: 'البث لم يتم العثور عليه' });
            } else {
                response.status(200).json({ message: 'تم تحديث حالة البث بنجاح' });
            }
        })
        .catch((error) => next(error));
};



//change stream status to active
exports.activateStream = (request, response, next) => {
    streamSchema
        .updateOne({ _id: request.params.id }, { status: 'active' })
        .then((data) => {
            // if there is no stream with this id
            if (!data) {
                response.status(404).json({ message: 'البث لم يتم العثور عليه' });
            } else {
                response.status(200).json({ message: 'تم تحديث حالة البث بنجاح' });
            }
        })
        .catch((error) => next(error));
} 
exports.deactivateStream = (request, response, next) => {
    streamSchema
        .updateOne({ _id: request.params.id }, { status: 'inactive' })
        .then((data) => {
            // if there is no stream with this id
            if (!data) {
                response.status(404).json({ message: 'البث لم يتم العثور عليه' });
            } else {
                response.status(200).json({ message: 'تم تحديث حالة البث بنجاح' });
            }
        })
        .catch((error) => next(error));
} 
