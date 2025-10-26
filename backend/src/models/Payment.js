const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, default: 0 },
  method: { type: String, default: 'cod' }, // cod | online
  providerId: { type: String }, // provider transaction id
  status: { type: String, enum: ['pending','completed','failed','refunded'], default: 'pending' },
  meta: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
