const mongoose = require('mongoose');

const Autoincrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const contactSchema = new Schema({
    id: {
        type: Number
    },
    name: {
        type: String,
        required: [true,'required name']
    },
    email: {
        type: String,
        //match email with regex
        match: [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, " Invalid Email"],
        required: [true,'required email']
    },
    phone: {
        type: String,
        //match phone with regex
        match: [/^01[0125][0-9]{8}$/, "Invalid phoneNumber"],
        
        required: [true,'required phone']
    },
    subject: {
        type: String,
        required: [true,'required subject']
    },
    message: {
        type: String,
        required: [true,'required message']
    }
}, {
    timestamps: true
});
contactSchema.plugin(Autoincrement,  {id: 'contact_id',inc_field: 'id'});

const contactModel = mongoose.model('contacts', contactSchema);