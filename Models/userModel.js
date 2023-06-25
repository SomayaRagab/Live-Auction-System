const mongoose = require('mongoose');

const Autoincrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    _id: {
      type: Number,
    },
    name: {
      type: String,
      required: [true, 'اسم المستخدم مطلوب'],
    },
    email: {
      type: String,
      
      unique: [true, 'البريد الإلكتروني مستخدم بالفعل'],
    },
    password: {
      type: String,
      
    },
    phone: {
      type: String,
      match: [/^01[0125][0-9]{8}$/, 'رقم الهاتف غير صحيح'],
      
    },
    address: {
      type: Object,
      city: {
        type: String,
        
      },
      street: {
        type: String,
        
      },
      building_number: {
        type: String,
        
      },
      
    },
    image: {
      type: String,
      
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    block: {
      type: Boolean,
      default: false,
    },
    expire_block: {
      type: Date,
      default: null,
    },
    itemNotPayed: {
      type: Number,
      default: 0,
    },
    resetPasswordToken: {
      type: String,
      default:''
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    facebookId: String,
    googleId: String
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(Autoincrement, { id: 'user_id', inc_field: '_id' });
mongoose.model('users', userSchema);
