// const express = require('express');
// const { body, param, query } = require('express-validator');
// const consultationController = require('../controllers/consultation.controller');
// const { protect } = require('../middleware/auth.middleware');

// const router = express.Router();

// // Validation middleware
// const bookConsultationValidation = [
//   body('doctorId')
//     .notEmpty()
//     .withMessage('Doctor ID is required')
//     .isMongoId()
//     .withMessage('Invalid doctor ID'),
//   body('appointmentDate')
//     .notEmpty()
//     .withMessage('Appointment date is required')
//     .isDate()
//     .withMessage('Invalid appointment date')
//     .custom((value) => {
//       const appointmentDate = new Date(value);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
      
//       if (appointmentDate < today) {
//         throw new Error('Appointment date cannot be in the past');
//       }
      
//       // Check if appointment is within 30 days
//       const thirtyDaysFromNow = new Date();
//       thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
//       if (appointmentDate > thirtyDaysFromNow) {
//         throw new Error('Appointment can only be booked within 30 days');
//       }
      
//       return true;
//     }),
//   body('appointmentTime')
//     .notEmpty()
//     .withMessage('Appointment time is required')
//     .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
//     .withMessage('Invalid time format. Use HH:MM format'),
//   body('consultationType')
//     .optional()
//     .isIn(['video', 'audio', 'chat'])
//     .withMessage('Invalid consultation type'),
//   body('symptoms')
//     .notEmpty()
//     .withMessage('Symptoms description is required')
//     .isLength({ min: 10, max: 1000 })
//     .withMessage('Symptoms description must be between 10 and 1000 characters'),
//   body('medicalHistory')
//     .optional()
//     .isLength({ max: 2000 })
//     .withMessage('Medical history cannot exceed 2000 characters'),
//   body('currentMedications')
//     .optional()
//     .isLength({ max: 1000 })
//     .withMessage('Current medications cannot exceed 1000 characters')
// ];

// const rateConsultationValidation = [
//   param('id')
//     .isMongoId()
//     .withMessage('Invalid consultation ID'),
//   body('rating')
//     .notEmpty()
//     .withMessage('Rating is required')
//     .isInt({ min: 1, max: 5 })
//     .withMessage('Rating must be between 1 and 5'),
//   body('review')
//     .optional()
//     .isLength({ max: 500 })
//     .withMessage('Review cannot exceed 500 characters')
// ];

// const mongoIdValidation = [
//   param('id')
//     .isMongoId()
//     .withMessage('Invalid ID format')
// ];

// const availableSlotsValidation = [
//   query('doctorId')
//     .notEmpty()
//     .withMessage('Doctor ID is required')
//     .isMongoId()
//     .withMessage('Invalid doctor ID'),
//   query('date')
//     .notEmpty()
//     .withMessage('Date is required')
//     .isDate()
//     .withMessage('Invalid date format')
//     .custom((value) => {
//       const queryDate = new Date(value);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
      
//       if (queryDate < today) {
//         throw new Error('Date cannot be in the past');
//       }
      
//       return true;
//     })
// ];

// // Public routes
// router.get('/doctors', consultationController.getDoctors);
// router.get('/doctors/:id', mongoIdValidation, consultationController.getDoctorById);
// router.get('/available-slots', availableSlotsValidation, consultationController.getAvailableSlots);

// // Protected routes (require authentication)
// router.use(protect);

// router.post('/book', bookConsultationValidation, consultationController.bookConsultation);
// router.get('/my-consultations', consultationController.getMyConsultations);
// router.get('/:id', mongoIdValidation, consultationController.getConsultationById);
// router.put('/:id/cancel', mongoIdValidation, consultationController.cancelConsultation);
// router.put('/:id/rate', rateConsultationValidation, consultationController.rateConsultation);

// module.exports = router;