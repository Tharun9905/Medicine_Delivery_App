const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  quantity: { type: Number, default: 1, min: 1 },
  price: { type: Number, default: 0 } // optional snapshot price
}, { _id: true });

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [CartItemSchema],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.models.Cart || mongoose.model('Cart', CartSchema);