const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Minimal upload info
  imageUrl: { type: String, required: [true, 'Image URL is required'] },
  mimeType: String,
  originalFileName: String,

  // Basic classification
  type: { type: String, enum: ['Digital', 'Handwritten', 'Printed'], default: 'Handwritten' },

  // Extracted medicines (lightweight)
  extractedMedicines: [{
    name: { type: String, required: true },
    dosage: String,
    strength: String,
    matchedMedicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }
  }],

  // Dates
  prescriptionDate: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    default: function () { return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); } // 1 year
  },

  // Status
  verificationStatus: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  verifiedAt: Date,

  // Minimal flags & usage
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  usageCount: { type: Number, default: 0 },

  // Optional relation to orders
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/* Indexes - keep small and useful */
prescriptionSchema.index({ user: 1 });
prescriptionSchema.index({ verificationStatus: 1 });

/* Virtuals */
prescriptionSchema.virtual('isExpired').get(function () {
  return this.expiresAt && (this.expiresAt < new Date());
});

/* Instance methods */
prescriptionSchema.methods.verify = function (adminId) {
  this.verificationStatus = 'Verified';
  this.verifiedBy = adminId;
  this.verifiedAt = new Date();
  this.isActive = true;
  return this.save();
};

prescriptionSchema.methods.reject = function (adminId, note) {
  this.verificationStatus = 'Rejected';
  this.verifiedBy = adminId;
  this.verifiedAt = new Date();
  this.isActive = false;
  return this.save();
};

prescriptionSchema.methods.incrementUsage = function () {
  this.usageCount += 1;
  return this.save();
};

prescriptionSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.isActive = false;
  return this.save();
};

module.exports = mongoose.model('Prescription', prescriptionSchema);