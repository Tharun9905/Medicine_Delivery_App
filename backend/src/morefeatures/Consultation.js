// const mongoose = require('mongoose');
// const mongoosePaginate = require('mongoose-paginate-v2');

// const consultationSchema = new mongoose.Schema({
//   patient: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: [true, 'Patient is required']
//   },
//   doctor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Doctor',
//     required: [true, 'Doctor is required']
//   },
//   appointmentDate: {
//     type: Date,
//     required: [true, 'Appointment date is required'],
//     validate: {
//       validator: function(date) {
//         return date > new Date();
//       },
//       message: 'Appointment date must be in the future'
//     }
//   },
//   appointmentTime: {
//     type: String,
//     required: [true, 'Appointment time is required'],
//     match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
//   },
//   consultationType: {
//     type: String,
//     enum: ['video', 'audio', 'chat'],
//     default: 'video'
//   },
//   symptoms: {
//     type: String,
//     required: [true, 'Symptoms description is required'],
//     maxlength: [1000, 'Symptoms description cannot exceed 1000 characters']
//   },
//   medicalHistory: {
//     type: String,
//     maxlength: [2000, 'Medical history cannot exceed 2000 characters']
//   },
//   currentMedications: {
//     type: String,
//     maxlength: [1000, 'Current medications cannot exceed 1000 characters']
//   },
//   status: {
//     type: String,
//     enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'no-show'],
//     default: 'scheduled'
//   },
//   consultationFee: {
//     type: Number,
//     required: [true, 'Consultation fee is required'],
//     min: [0, 'Fee cannot be negative']
//   },
//   paymentStatus: {
//     type: String,
//     enum: ['pending', 'paid', 'failed', 'refunded'],
//     default: 'pending'
//   },
//   paymentId: {
//     type: String,
//     default: null
//   },
//   meetingLink: {
//     type: String,
//     default: null
//   },
//   prescription: {
//     medications: [{
//       medicine: { type: String, required: true },
//       dosage: { type: String, required: true },
//       frequency: { type: String, required: true },
//       duration: { type: String, required: true },
//       instructions: { type: String }
//     }],
//     diagnosis: { type: String },
//     followUpDate: { type: Date },
//     additionalNotes: { type: String, maxlength: [1000, 'Additional notes cannot exceed 1000 characters'] }
//   },
//   rating: {
//     patientRating: { type: Number, min: 1, max: 5 },
//     patientReview: { type: String, maxlength: [500, 'Review cannot exceed 500 characters'] },
//     doctorNotes: { type: String, maxlength: [1000, 'Doctor notes cannot exceed 1000 characters'] }
//   },
//   duration: {
//     type: Number, // in minutes
//     default: 30
//   },
//   startTime: {
//     type: Date,
//     default: null
//   },
//   endTime: {
//     type: Date,
//     default: null
//   },
//   cancelReason: {
//     type: String,
//     maxlength: [200, 'Cancel reason cannot exceed 200 characters']
//   },
//   cancelledBy: {
//     type: String,
//     enum: ['patient', 'doctor', 'system'],
//     default: null
//   }
// }, {
//   timestamps: true
// });

// // Index for better query performance
// consultationSchema.index({ patient: 1, status: 1 });
// consultationSchema.index({ doctor: 1, status: 1 });
// consultationSchema.index({ appointmentDate: 1, appointmentTime: 1 });
// consultationSchema.index({ createdAt: -1 });

// // Virtual for total consultation time
// consultationSchema.virtual('actualDuration').get(function() {
//   if (this.startTime && this.endTime) {
//     return Math.round((this.endTime - this.startTime) / (1000 * 60)); // in minutes
//   }
//   return null;
// });

// // Add pagination plugin
// consultationSchema.plugin(mongoosePaginate);

// module.exports = mongoose.model('Consultation', consultationSchema);