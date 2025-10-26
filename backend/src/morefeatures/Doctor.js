// const mongoose = require('mongoose');
// const mongoosePaginate = require('mongoose-paginate-v2');

// const doctorSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Doctor name is required'],
//     trim: true,
//     maxlength: [100, 'Doctor name cannot exceed 100 characters']
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     lowercase: true,
//     match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
//   },
//   phone: {
//     type: String,
//     required: [true, 'Phone number is required'],
//     match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number']
//   },
//   specialization: {
//     type: String,
//     required: [true, 'Specialization is required'],
//     enum: [
//       'General Medicine',
//       'Cardiology',
//       'Dermatology',
//       'Pediatrics',
//       'Gynecology',
//       'Orthopedics',
//       'Neurology',
//       'Psychiatry',
//       'ENT',
//       'Ophthalmology',
//       'Dentistry',
//       'Other'
//     ]
//   },
//   experience: {
//     type: Number,
//     required: [true, 'Experience is required'],
//     min: [0, 'Experience cannot be negative'],
//     max: [50, 'Experience cannot exceed 50 years']
//   },
//   qualification: {
//     type: String,
//     required: [true, 'Qualification is required'],
//     trim: true
//   },
//   consultationFee: {
//     type: Number,
//     required: [true, 'Consultation fee is required'],
//     min: [0, 'Fee cannot be negative']
//   },
//   bio: {
//     type: String,
//     maxlength: [500, 'Bio cannot exceed 500 characters']
//   },
//   profileImage: {
//     type: String,
//     default: null
//   },
//   isAvailable: {
//     type: Boolean,
//     default: true
//   },
//   availability: {
//     monday: { start: String, end: String, available: { type: Boolean, default: true } },
//     tuesday: { start: String, end: String, available: { type: Boolean, default: true } },
//     wednesday: { start: String, end: String, available: { type: Boolean, default: true } },
//     thursday: { start: String, end: String, available: { type: Boolean, default: true } },
//     friday: { start: String, end: String, available: { type: Boolean, default: true } },
//     saturday: { start: String, end: String, available: { type: Boolean, default: false } },
//     sunday: { start: String, end: String, available: { type: Boolean, default: false } }
//   },
//   rating: {
//     type: Number,
//     default: 0,
//     min: [0, 'Rating cannot be negative'],
//     max: [5, 'Rating cannot exceed 5']
//   },
//   totalConsultations: {
//     type: Number,
//     default: 0,
//     min: [0, 'Total consultations cannot be negative']
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   }
// }, {
//   timestamps: true
// });

// // Index for better query performance
// doctorSchema.index({ specialization: 1, isAvailable: 1, isActive: 1 });
// doctorSchema.index({ rating: -1 });
// doctorSchema.index({ consultationFee: 1 });

// // Add pagination plugin
// doctorSchema.plugin(mongoosePaginate);

// module.exports = mongoose.model('Doctor', doctorSchema);