const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const medicineSchema = new mongoose.Schema({
  // Minimal required fields for a real-world pharmacy
  name: { type: String, required: [true, 'Medicine name is required'], trim: true, maxlength: 200 },
  category: { type: String, required: [true, 'Category is required'], trim: true },
  packSize: { type: String, required: [true, 'Pack size is required'], trim: true },
  manufacturer: { type: String, trim: true },
  description: { type: String, trim: true, maxlength: 1000 },

  // Pricing & tax
  mrp: { type: Number, required: [true, 'MRP is required'], min: 0 },
  price: { type: Number, required: [true, 'Price is required'], min: 0 }, // Frontend expects 'price'
  sellingPrice: { type: Number }, // Keep for backward compatibility
  discount: { type: Number, default: 0, min: 0, max: 100 },
  gst: { type: Number, default: 12, min: 0 },

  // Inventory & expiry
  stock: { type: Number, default: 0, min: 0 },
  expiryDate: { type: Date, required: [true, 'Expiry date is required'] },

  // Status flags
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isPrescriptionRequired: { type: Boolean, default: false },

  // Additional fields for popularity
  soldCount: { type: Number, default: 0 },

  // Images included but optional
  images: [{
    url: { type: String },
    alt: { type: String },
    isPrimary: { type: Boolean, default: false }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/* Indexes */
medicineSchema.index({ name: 'text' });
medicineSchema.index({ category: 1 });
medicineSchema.index({ expiryDate: 1 });
medicineSchema.index({ sellingPrice: 1 });

/* Pre-save middleware to sync price and sellingPrice */
medicineSchema.pre('save', function(next) {
  if (this.price && !this.sellingPrice) {
    this.sellingPrice = this.price;
  } else if (this.sellingPrice && !this.price) {
    this.price = this.sellingPrice;
  }
  next();
});

/* Virtuals */
medicineSchema.virtual('discountPercent').get(function() {
  if (!this.mrp || !this.price) return 0;
  if (this.mrp <= this.price) return 0;
  return Math.round(((this.mrp - this.price) / this.mrp) * 100);
});

medicineSchema.virtual('stockStatus').get(function() {
  if (this.stock === 0) return 'out-of-stock';
  if (this.stock <= 5) return 'low-stock';
  return 'in-stock';
});

/* Methods */
medicineSchema.methods.updateStock = function(quantity, operation = 'decrease') {
  if (operation === 'decrease') {
    if (this.stock < quantity) throw new Error('Insufficient stock');
    this.stock -= quantity;
  } else {
    this.stock += quantity;
  }
  return this.save();
};

/* Pagination plugin (optional for listings) */
medicineSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Medicine', medicineSchema);
