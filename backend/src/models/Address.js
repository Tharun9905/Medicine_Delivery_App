const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  contactPerson: { type: String, required: true, trim: true, maxlength: 100 },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: v => /^[\+]?[0-9]{7,15}$/.test(v),
      message: 'Please enter a valid phone number'
    }
  },

  addressLine1: { type: String, required: true, trim: true, maxlength: 200 },
  addressLine2: { type: String, trim: true, maxlength: 200 },

  city: { type: String, required: true, trim: true, maxlength: 50 },
  state: { type: String, required: true, trim: true, maxlength: 50 },
  pincode: {
    type: String,
    required: true,
    trim: true,
    validate: { validator: v => /^[0-9]{6}$/.test(v), message: 'Please enter a valid 6-digit pincode' }
  },

  country: { type: String, default: 'India', trim: true },

  isDefault: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },

  deliveryInstructions: { type: String, trim: true, maxlength: 500 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/* Indexes */
addressSchema.index({ user: 1, isDefault: -1 });
addressSchema.index({ pincode: 1 });

/* Virtuals */
addressSchema.virtual('fullAddress').get(function () {
  let a = this.addressLine1;
  if (this.addressLine2) a += ', ' + this.addressLine2;
  a += ', ' + this.city + ', ' + this.state + ' - ' + this.pincode;
  return a;
});

/* Instance methods */
addressSchema.methods.setAsDefault = async function () {
  await this.constructor.updateMany({ user: this.user, _id: { $ne: this._id } }, { isDefault: false });
  this.isDefault = true;
  return this.save();
};

/* Statics */
addressSchema.statics.getUserAddresses = function (userId) {
  return this.find({ user: userId, isActive: true }).sort({ isDefault: -1, updatedAt: -1 });
};

addressSchema.statics.getDefaultAddress = function (userId) {
  return this.findOne({ user: userId, isDefault: true, isActive: true });
};

module.exports = mongoose.model('Address', addressSchema);