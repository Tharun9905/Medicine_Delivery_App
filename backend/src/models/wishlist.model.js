const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [wishlistItemSchema],
  totalItems: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Update total items count when items change
wishlistSchema.pre('save', function(next) {
  this.totalItems = this.items.length;
  next();
});

// Index for efficient queries
wishlistSchema.index({ user: 1 });
wishlistSchema.index({ 'items.medicine': 1 });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;