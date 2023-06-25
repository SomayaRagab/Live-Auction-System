const mongoose = require('mongoose');

const Autoincrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const contactSchema = new Schema({
    id: {
        type: Number
    },
    name: {
        type: String,
        required: [true,'الاسم مطلوب']
    },
    email: {
        type: String,
        //match email with regex
        match: [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, " البريد الإلكتروني غير صحيح"],
        required: [true,'البريد الإلكتروني مطلوب']
    },
    phone: {
        type: String,
        //match phone with regex
        match: [/^01[0125][0-9]{8}$/, "رقم الهاتف غير صحيح"],
        
        required: [true,'رقم الهاتف مطلوب']
    },
    subject: {
        type: String,
        required: [true,'الموضوع مطلوب']
    },
    message: {
        type: String,
        required: [true,'الرسالة مطلوبة']
    }
}, {
    timestamps: true
});
contactSchema.plugin(Autoincrement,  {id: 'contact_id',inc_field: 'id'});

const contacts = mongoose.model('contacts', contactSchema);