const mongoose = require('mongoose');
const autions=mongoose.model('auctions');

const autoIncrement = require('mongoose-sequence')(mongoose);
const streamSchema = mongoose.Schema(
    {
        _id: {
            type: Number,
        },
        title: {
            type: String,
            required: [true, 'عنوان البث مطلوب'],
        },
        description: {
            type: String,
            required: [true, 'الوصف مطلوب'],
        },
        link :{
            type: String,
            required: [true, 'الرابط مطلوب']
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'inactive'
        }
    },
     {
        timestamps: true,
      }
    );
    
    streamSchema.plugin(autoIncrement, { id: 'stream_id', inc_field: '_id' });
    const stream = mongoose.model('stream', streamSchema);
    

