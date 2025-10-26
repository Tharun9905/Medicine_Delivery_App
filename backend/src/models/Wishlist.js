const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  medicines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema);
