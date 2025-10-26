// const mongoose = require('mongoose');

// const labTestSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Test name is required'],
//     trim: true,
//     maxLength: [100, 'Test name cannot be more than 100 characters']
//   },
  
//   code: {
//     type: String,
//     required: [true, 'Test code is required'],
//     unique: true,
//     trim: true,
//     uppercase: true
//   },
  
//   description: {
//     type: String,
//     required: [true, 'Test description is required'],
//     trim: true,
//     maxLength: [500, 'Description cannot be more than 500 characters']
//   },
  
//   category: {
//     type: String,
//     required: [true, 'Category is required'],
//     enum: [
//       'blood-test',
//       'urine-test',
//       'thyroid-test',
//       'diabetes-test',
//       'lipid-profile',
//       'liver-function',
//       'kidney-function',
//       'cardiac-test',
//       'vitamin-test',
//       'hormone-test',
//       'cancer-screening',
//       'infectious-disease',
//       'allergy-test',
//       'health-checkup',
//       'other'
//     ]
//   },
  
//   subcategory: {
//     type: String,
//     trim: true
//   },
  
//   price: {
//     mrp: {
//       type: Number,
//       required: [true, 'MRP is required'],
//       min: [0, 'MRP cannot be negative']
//     },
//     sellingPrice: {
//       type: Number,
//       required: [true, 'Selling price is required'],
//       min: [0, 'Selling price cannot be negative']
//     },
//     discount: {
//       type: Number,
//       default: 0,
//       min: [0, 'Discount cannot be negative'],
//       max: [100, 'Discount cannot be more than 100%']
//     }
//   },
  
//   sampleType: {
//     type: [String],
//     required: true,
//     enum: [
//       'blood',
//       'urine',
//       'saliva',
//       'stool',
//       'swab',
//       'tissue',
//       'sputum',
//       'other'
//     ]
//   },
  
//   sampleVolume: {
//     type: String,
//     trim: true
//   },
  
//   fasting: {
//     required: {
//       type: Boolean,
//       default: false
//     },
//     hours: {
//       type: Number,
//       default: 0,
//       min: [0, 'Fasting hours cannot be negative']
//     }
//   },
  
//   reportTime: {
//     value: {
//       type: Number,
//       required: [true, 'Report time is required'],
//       min: [1, 'Report time must be at least 1']
//     },
//     unit: {
//       type: String,
//       required: [true, 'Report time unit is required'],
//       enum: ['hours', 'days', 'weeks']
//     }
//   },
  
//   homeCollection: {
//     available: {
//       type: Boolean,
//       default: true
//     },
//     charge: {
//       type: Number,
//       default: 0,
//       min: [0, 'Home collection charge cannot be negative']
//     },
//     freeAbove: {
//       type: Number,
//       default: 0,
//       min: [0, 'Free above amount cannot be negative']
//     }
//   },
  
//   preparation: [{
//     type: String,
//     trim: true
//   }],
  
//   includes: [{
//     parameter: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     normalRange: {
//       min: Number,
//       max: Number,
//       unit: String,
//       note: String
//     }
//   }],
  
//   age: {
//     min: {
//       type: Number,
//       default: 0,
//       min: [0, 'Minimum age cannot be negative']
//     },
//     max: {
//       type: Number,
//       default: 120,
//       max: [120, 'Maximum age cannot be more than 120']
//     }
//   },
  
//   gender: {
//     type: String,
//     enum: ['male', 'female', 'both'],
//     default: 'both'
//   },
  
//   contraindications: [{
//     type: String,
//     trim: true
//   }],
  
//   images: [{
//     url: String,
//     alt: String,
//     caption: String
//   }],
  
//   tags: [{
//     type: String,
//     trim: true,
//     lowercase: true
//   }],
  
//   isActive: {
//     type: Boolean,
//     default: true
//   },
  
//   isPopular: {
//     type: Boolean,
//     default: false
//   },
  
//   isFeatured: {
//     type: Boolean,
//     default: false
//   },
  
//   rating: {
//     average: {
//       type: Number,
//       default: 0,
//       min: [0, 'Rating cannot be less than 0'],
//       max: [5, 'Rating cannot be more than 5']
//     },
//     count: {
//       type: Number,
//       default: 0,
//       min: [0, 'Rating count cannot be negative']
//     }
//   },
  
//   orderCount: {
//     type: Number,
//     default: 0,
//     min: [0, 'Order count cannot be negative']
//   },
  
//   viewCount: {
//     type: Number,
//     default: 0,
//     min: [0, 'View count cannot be negative']
//   },
  
//   availability: {
//     status: {
//       type: String,
//       enum: ['available', 'unavailable', 'coming-soon'],
//       default: 'available'
//     },
//     locations: [{
//       city: String,
//       pincode: [String],
//       available: {
//         type: Boolean,
//         default: true
//       }
//     }]
//   },
  
//   labPartner: {
//     name: String,
//     accreditation: [String],
//     location: String
//   },
  
//   metadata: {
//     keywords: [String],
//     searchTags: [String],
//     relatedTests: [{
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'LabTest'
//     }]
//   }
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Indexes for better search performance
// labTestSchema.index({ name: 'text', description: 'text', tags: 'text' });
// labTestSchema.index({ category: 1, subcategory: 1 });
// labTestSchema.index({ 'price.sellingPrice': 1 });
// labTestSchema.index({ isActive: 1, isPopular: 1, isFeatured: 1 });
// labTestSchema.index({ 'rating.average': -1, orderCount: -1 });

// // Virtual for actual discount amount
// labTestSchema.virtual('discountAmount').get(function() {
//   return this.price.mrp - this.price.sellingPrice;
// });

// // Virtual for discount percentage
// labTestSchema.virtual('discountPercentage').get(function() {
//   if (this.price.mrp === 0) return 0;
//   return Math.round(((this.price.mrp - this.price.sellingPrice) / this.price.mrp) * 100);
// });

// // Virtual for estimated report delivery
// labTestSchema.virtual('estimatedReportDate').get(function() {
//   const now = new Date();
//   const reportTime = this.reportTime;
  
//   switch (reportTime.unit) {
//     case 'hours':
//       return new Date(now.getTime() + (reportTime.value * 60 * 60 * 1000));
//     case 'days':
//       return new Date(now.getTime() + (reportTime.value * 24 * 60 * 60 * 1000));
//     case 'weeks':
//       return new Date(now.getTime() + (reportTime.value * 7 * 24 * 60 * 60 * 1000));
//     default:
//       return new Date(now.getTime() + (24 * 60 * 60 * 1000)); // Default 1 day
//   }
// });

// // Methods
// labTestSchema.methods.incrementViewCount = function() {
//   this.viewCount += 1;
//   return this.save();
// };

// labTestSchema.methods.updateRating = function(newRating) {
//   const totalRating = (this.rating.average * this.rating.count) + newRating;
//   this.rating.count += 1;
//   this.rating.average = totalRating / this.rating.count;
//   return this.save();
// };

// // Static methods for common queries
// labTestSchema.statics.getPopularTests = function(limit = 10) {
//   return this.find({ isActive: true, isPopular: true })
//     .sort({ orderCount: -1, 'rating.average': -1 })
//     .limit(limit);
// };

// labTestSchema.statics.getFeaturedTests = function(limit = 10) {
//   return this.find({ isActive: true, isFeatured: true })
//     .sort({ orderCount: -1 })
//     .limit(limit);
// };

// labTestSchema.statics.searchTests = function(query, options = {}) {
//   const searchQuery = {
//     isActive: true,
//     $text: { $search: query }
//   };
  
//   if (options.category) {
//     searchQuery.category = options.category;
//   }
  
//   if (options.priceRange) {
//     searchQuery['price.sellingPrice'] = {
//       $gte: options.priceRange.min || 0,
//       $lte: options.priceRange.max || Infinity
//     };
//   }
  
//   return this.find(searchQuery)
//     .sort({ score: { $meta: 'textScore' }, orderCount: -1 })
//     .limit(options.limit || 50);
// };

// // Pre-save middleware
// labTestSchema.pre('save', function(next) {
//   // Auto-calculate discount if not provided
//   if (!this.price.discount && this.price.mrp && this.price.sellingPrice) {
//     this.price.discount = Math.round(((this.price.mrp - this.price.sellingPrice) / this.price.mrp) * 100);
//   }
  
//   // Generate search tags from name and description
//   if (this.isModified('name') || this.isModified('description')) {
//     const searchWords = [
//       ...this.name.toLowerCase().split(/\s+/),
//       ...this.description.toLowerCase().split(/\s+/)
//     ];
//     this.metadata.searchTags = [...new Set(searchWords.filter(word => word.length > 2))];
//   }
  
//   next();
// });

// const LabTest = mongoose.model('LabTest', labTestSchema);

// module.exports = LabTest;