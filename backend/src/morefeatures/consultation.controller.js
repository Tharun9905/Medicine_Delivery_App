// const Consultation = require('../models/Consultation');
// const Doctor = require('../models/Doctor');
// const User = require('../models/User');
// const { validationResult } = require('express-validator');

// // Get all available doctors
// exports.getDoctors = async (req, res) => {
//   try {
//     const { specialization, minRating, maxFee, sortBy, page = 1, limit = 10 } = req.query;
    
//     // Build query
//     const query = { isActive: true, isAvailable: true };
    
//     if (specialization) {
//       query.specialization = specialization;
//     }
    
//     if (minRating) {
//       query.rating = { $gte: parseFloat(minRating) };
//     }
    
//     if (maxFee) {
//       query.consultationFee = { $lte: parseFloat(maxFee) };
//     }

//     // Build sort criteria
//     let sortCriteria = {};
//     switch (sortBy) {
//       case 'rating':
//         sortCriteria = { rating: -1, totalConsultations: -1 };
//         break;
//       case 'fee-low':
//         sortCriteria = { consultationFee: 1 };
//         break;
//       case 'fee-high':
//         sortCriteria = { consultationFee: -1 };
//         break;
//       case 'experience':
//         sortCriteria = { experience: -1 };
//         break;
//       default:
//         sortCriteria = { rating: -1, totalConsultations: -1 };
//     }

//     const options = {
//       page: parseInt(page),
//       limit: parseInt(limit),
//       sort: sortCriteria,
//       select: '-createdAt -updatedAt'
//     };

//     const doctors = await Doctor.paginate(query, options);

//     res.json({
//       success: true,
//       message: 'Doctors retrieved successfully',
//       data: doctors
//     });
//   } catch (error) {
//     console.error('Get doctors error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get doctors',
//       error: error.message
//     });
//   }
// };

// // Get doctor by ID
// exports.getDoctorById = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const doctor = await Doctor.findById(id).select('-createdAt -updatedAt');
    
//     if (!doctor) {
//       return res.status(404).json({
//         success: false,
//         message: 'Doctor not found'
//       });
//     }

//     if (!doctor.isActive) {
//       return res.status(400).json({
//         success: false,
//         message: 'Doctor is not available for consultations'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Doctor details retrieved successfully',
//       data: doctor
//     });
//   } catch (error) {
//     console.error('Get doctor by ID error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get doctor details',
//       error: error.message
//     });
//   }
// };

// // Book consultation
// exports.bookConsultation = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: errors.array()
//       });
//     }

//     const userId = req.user.userId;
//     const {
//       doctorId,
//       appointmentDate,
//       appointmentTime,
//       consultationType,
//       symptoms,
//       medicalHistory,
//       currentMedications
//     } = req.body;

//     // Check if doctor exists and is available
//     const doctor = await Doctor.findById(doctorId);
//     if (!doctor || !doctor.isActive || !doctor.isAvailable) {
//       return res.status(400).json({
//         success: false,
//         message: 'Doctor is not available for consultations'
//       });
//     }

//     // Check if the time slot is available
//     const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
//     const existingConsultation = await Consultation.findOne({
//       doctor: doctorId,
//       appointmentDate: new Date(appointmentDate),
//       appointmentTime,
//       status: { $in: ['scheduled', 'in-progress'] }
//     });

//     if (existingConsultation) {
//       return res.status(400).json({
//         success: false,
//         message: 'Time slot is already booked'
//       });
//     }

//     // Create consultation
//     const consultation = new Consultation({
//       patient: userId,
//       doctor: doctorId,
//       appointmentDate: new Date(appointmentDate),
//       appointmentTime,
//       consultationType: consultationType || 'video',
//       symptoms,
//       medicalHistory,
//       currentMedications,
//       consultationFee: doctor.consultationFee,
//       meetingLink: `https://meet.mediquick.com/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
//     });

//     await consultation.save();

//     // Populate doctor and patient details
//     await consultation.populate([
//       { path: 'doctor', select: 'name specialization profileImage' },
//       { path: 'patient', select: 'name email phone' }
//     ]);

//     res.status(201).json({
//       success: true,
//       message: 'Consultation booked successfully',
//       data: consultation
//     });
//   } catch (error) {
//     console.error('Book consultation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to book consultation',
//       error: error.message
//     });
//   }
// };

// // Get user consultations
// exports.getMyConsultations = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { status, page = 1, limit = 10 } = req.query;

//     const query = { patient: userId };
//     if (status) {
//       query.status = status;
//     }

//     const options = {
//       page: parseInt(page),
//       limit: parseInt(limit),
//       sort: { appointmentDate: -1, appointmentTime: -1 },
//       populate: [
//         { path: 'doctor', select: 'name specialization profileImage rating' }
//       ]
//     };

//     const consultations = await Consultation.paginate(query, options);

//     res.json({
//       success: true,
//       message: 'Consultations retrieved successfully',
//       data: consultations
//     });
//   } catch (error) {
//     console.error('Get my consultations error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get consultations',
//       error: error.message
//     });
//   }
// };

// // Get consultation by ID
// exports.getConsultationById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.userId;

//     const consultation = await Consultation.findById(id)
//       .populate('doctor', 'name specialization profileImage rating experience')
//       .populate('patient', 'name email phone');

//     if (!consultation) {
//       return res.status(404).json({
//         success: false,
//         message: 'Consultation not found'
//       });
//     }

//     // Check if user is authorized to view this consultation
//     if (consultation.patient._id.toString() !== userId) {
//       return res.status(403).json({
//         success: false,
//         message: 'Access denied'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Consultation details retrieved successfully',
//       data: consultation
//     });
//   } catch (error) {
//     console.error('Get consultation by ID error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get consultation details',
//       error: error.message
//     });
//   }
// };

// // Cancel consultation
// exports.cancelConsultation = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.userId;
//     const { reason } = req.body;

//     const consultation = await Consultation.findById(id);

//     if (!consultation) {
//       return res.status(404).json({
//         success: false,
//         message: 'Consultation not found'
//       });
//     }

//     // Check if user is authorized to cancel this consultation
//     if (consultation.patient.toString() !== userId) {
//       return res.status(403).json({
//         success: false,
//         message: 'Access denied'
//       });
//     }

//     // Check if consultation can be cancelled
//     if (consultation.status !== 'scheduled') {
//       return res.status(400).json({
//         success: false,
//         message: 'Only scheduled consultations can be cancelled'
//       });
//     }

//     // Check cancellation policy (e.g., at least 2 hours before appointment)
//     const appointmentDateTime = new Date(`${consultation.appointmentDate.toISOString().split('T')[0]}T${consultation.appointmentTime}`);
//     const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000);

//     if (appointmentDateTime < twoHoursFromNow) {
//       return res.status(400).json({
//         success: false,
//         message: 'Consultations can only be cancelled at least 2 hours in advance'
//       });
//     }

//     consultation.status = 'cancelled';
//     consultation.cancelReason = reason;
//     consultation.cancelledBy = 'patient';
//     consultation.paymentStatus = 'refunded';

//     await consultation.save();

//     res.json({
//       success: true,
//       message: 'Consultation cancelled successfully',
//       data: consultation
//     });
//   } catch (error) {
//     console.error('Cancel consultation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to cancel consultation',
//       error: error.message
//     });
//   }
// };

// // Rate consultation
// exports.rateConsultation = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: errors.array()
//       });
//     }

//     const { id } = req.params;
//     const userId = req.user.userId;
//     const { rating, review } = req.body;

//     const consultation = await Consultation.findById(id);

//     if (!consultation) {
//       return res.status(404).json({
//         success: false,
//         message: 'Consultation not found'
//       });
//     }

//     // Check if user is authorized to rate this consultation
//     if (consultation.patient.toString() !== userId) {
//       return res.status(403).json({
//         success: false,
//         message: 'Access denied'
//       });
//     }

//     // Check if consultation is completed
//     if (consultation.status !== 'completed') {
//       return res.status(400).json({
//         success: false,
//         message: 'Only completed consultations can be rated'
//       });
//     }

//     // Check if already rated
//     if (consultation.rating && consultation.rating.patientRating) {
//       return res.status(400).json({
//         success: false,
//         message: 'Consultation already rated'
//       });
//     }

//     // Update consultation rating
//     consultation.rating = {
//       patientRating: rating,
//       patientReview: review
//     };

//     await consultation.save();

//     // Update doctor's overall rating
//     const doctor = await Doctor.findById(consultation.doctor);
//     const allRatings = await Consultation.find({
//       doctor: consultation.doctor,
//       'rating.patientRating': { $exists: true }
//     });

//     if (allRatings.length > 0) {
//       const totalRating = allRatings.reduce((sum, consultation) => sum + consultation.rating.patientRating, 0);
//       doctor.rating = (totalRating / allRatings.length).toFixed(1);
//       await doctor.save();
//     }

//     res.json({
//       success: true,
//       message: 'Consultation rated successfully',
//       data: consultation
//     });
//   } catch (error) {
//     console.error('Rate consultation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to rate consultation',
//       error: error.message
//     });
//   }
// };

// // Get available time slots for a doctor
// exports.getAvailableSlots = async (req, res) => {
//   try {
//     const { doctorId, date } = req.query;

//     if (!doctorId || !date) {
//       return res.status(400).json({
//         success: false,
//         message: 'Doctor ID and date are required'
//       });
//     }

//     const doctor = await Doctor.findById(doctorId);
//     if (!doctor || !doctor.isActive || !doctor.isAvailable) {
//       return res.status(400).json({
//         success: false,
//         message: 'Doctor is not available'
//       });
//     }

//     const queryDate = new Date(date);
//     const dayOfWeek = queryDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
    
//     // Check if doctor is available on this day
//     const dayAvailability = doctor.availability[dayOfWeek];
//     if (!dayAvailability || !dayAvailability.available) {
//       return res.json({
//         success: true,
//         message: 'No slots available for this date',
//         data: { availableSlots: [] }
//       });
//     }

//     // Generate time slots (30-minute intervals)
//     const slots = [];
//     const startTime = dayAvailability.start || '09:00';
//     const endTime = dayAvailability.end || '17:00';
    
//     const [startHour, startMinute] = startTime.split(':').map(Number);
//     const [endHour, endMinute] = endTime.split(':').map(Number);
    
//     const startMinutes = startHour * 60 + startMinute;
//     const endMinutes = endHour * 60 + endMinute;
    
//     for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
//       const hour = Math.floor(minutes / 60);
//       const minute = minutes % 60;
//       const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
//       slots.push(timeSlot);
//     }

//     // Get booked slots for the date
//     const bookedConsultations = await Consultation.find({
//       doctor: doctorId,
//       appointmentDate: queryDate,
//       status: { $in: ['scheduled', 'in-progress'] }
//     }).select('appointmentTime');

//     const bookedSlots = bookedConsultations.map(consultation => consultation.appointmentTime);
//     const availableSlots = slots.filter(slot => !bookedSlots.includes(slot));

//     res.json({
//       success: true,
//       message: 'Available slots retrieved successfully',
//       data: { availableSlots, totalSlots: slots.length, bookedSlots: bookedSlots.length }
//     });
//   } catch (error) {
//     console.error('Get available slots error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get available slots',
//       error: error.message
//     });
//   }
// };