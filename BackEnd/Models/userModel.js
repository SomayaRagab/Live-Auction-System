
const mongoose = require('mongoose');

const Autoincrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: {
        type: Number
    },
    name: {
        type: String,
        required: [true,'required name']
    },
    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, " Invalid Email"],
        required: [true,'required email'],
        unique: [true,'email already exists']


    },
    password: {
        type: String,
        required: [true,'required password']
    },
    phone: {
        type: String,
        match: [/^01[0125][0-9]{8}$/, "Invalid phoneNumber"],
        required: [true,'required phone']
    },
    address: {
        type: Object,
        city:{
            type: String,
            required: [true,'required city']
        },
        street:{
            type: String,   
            required: [true,'required street']
        },
        building_number:{
            type: String,
            required: [true,'required building number']
        },
        required: [true,'required address']
    },
    image:{
        type: String,
        required: [true,'required image']
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        required: [true,'required role']
    }
}, {
    timestamps: true
});

userSchema.plugin(Autoincrement,  {id: 'user_id',inc_field: 'id'});

const users = mongoose.model('users', userSchema);