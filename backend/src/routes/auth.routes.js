const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Validation middleware
const validatePhoneNumber = body('phoneNumber')
  .matches(/^[\+]?[1-9]?[0-9]{7,15}$/)
  .withMessage('Please provide a valid phone number');

const validateOTP = body('otp')
  .isLength({ min: 4, max: 6 })
  .isNumeric()
  .withMessage('OTP must be 4-6 digits');

const validateEmail = body('email')
  .optional()
  .isEmail()
  .withMessage('Please provide a valid email');

// Public routes
router.post('/register', [
  validatePhoneNumber,
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  validateEmail
], authController.register);

router.post('/send-otp', [validatePhoneNumber], authController.sendOTP);
router.post('/login', [validatePhoneNumber], authController.login);
router.post('/verify-otp', [validatePhoneNumber, validateOTP], authController.verifyOTP);

// Google Authentication routes
router.post('/google', authController.googleAuth);
router.post('/link-phone', protect, authController.linkPhoneToGoogleAccount);
router.post('/verify-phone-link', protect, authController.verifyPhoneLink);

// Protected routes
router.get('/me', protect, authController.getMe);
router.put('/update-profile', protect, authController.updateProfile);
router.post('/change-phone', protect, authController.changePhoneNumber);
router.post('/verify-phone-change', protect, authController.verifyPhoneChange);
router.post('/logout', protect, authController.logout);
router.delete('/delete-account', protect, authController.deleteAccount);

module.exports = router;