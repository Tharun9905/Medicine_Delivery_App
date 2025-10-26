const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const smsService = require('../services/sms.service');
const { OAuth2Client } = require('google-auth-library');

// Initialize Google OAuth2 client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      phoneNumber: user.phoneNumber,
      isVerified: user.isVerified 
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRE || '7d' 
    }
  );
};

// Helper function to send response with token
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken(user);

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      message,
      token,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        preferences: user.preferences,
        rewardPoints: user.rewardPoints,
        membership: user.membership
      }
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { phoneNumber, name, email } = req.body;

    // Check if user already exists
    let user = await User.findOne({ phoneNumber });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this phone number'
      });
    }

    // Create new user
    user = new User({
      phoneNumber,
      name: name || undefined,
      email: email || undefined
    });

    // Generate and save OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP via SMS service
    try {
      await smsService.sendOTP(phoneNumber, otp, 'registration');
    } catch (smsError) {
      console.error('SMS Error:', smsError.message);
      // Continue without failing the registration
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. OTP sent to your phone number.',
      // Include OTP in development mode only
      ...(process.env.NODE_ENV === 'development' && { otp })
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Send OTP to phone number
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { phoneNumber } = req.body;

    // Find or create user
    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = new User({ phoneNumber });
    }

    // Check rate limiting (max 3 OTPs per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (user.otp && user.otp.attempts >= 3 && user.otp.expiresAt > oneHourAgo) {
      return res.status(429).json({
        success: false,
        message: 'Too many OTP requests. Please try again after an hour.'
      });
    }

    // Generate new OTP
    const otp = user.generateOTP();
    await user.save();

    // Send SMS
    try {
      await smsService.sendOTP(phoneNumber, otp, 'verification');
    } catch (smsError) {
      console.error('SMS Error:', smsError.message);
      // Continue without failing the request
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your phone number',
      ...(process.env.NODE_ENV === 'development' && { otp })
    });

  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Verify OTP and login
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { phoneNumber, otp } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first.'
      });
    }

    // Verify OTP
    const verificationResult = user.verifyOTP(otp);
    if (!verificationResult.success) {
      await user.save(); // Save updated attempts
      return res.status(401).json({
        success: false,
        message: verificationResult.message
      });
    }

    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    // Replace direct call to user.updateActivity() with a safe, resilient update
    try {
      if (user && typeof user.updateActivity === 'function') {
        // preserve original behavior when the instance method exists
        await user.updateActivity();
      } else if (user && (user._id || user.id)) {
        // fallback: update a conventional timestamp field so activity is recorded
        const UserModel = require('../models/User');
        await UserModel.findByIdAndUpdate(user._id || user.id, { $set: { lastActiveAt: new Date() } });
      }
    } catch (activityErr) {
      // log but don't break OTP verification flow
      console.warn('Failed to record user activity during OTP verification:', activityErr && activityErr.message ? activityErr.message : activityErr);
    }

    // Send response with token
    sendTokenResponse(user, 200, res, 'Login successful');

  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'OTP verification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Login with phone number (send OTP)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { phoneNumber } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first.'
      });
    }

    // Generate OTP for login
    const otp = user.generateOTP();
    await user.save();

    // Send OTP via SMS
    try {
      await smsService.sendOTP(phoneNumber, otp, 'login');
    } catch (smsError) {
      console.error('SMS Error:', smsError.message);
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      ...(process.env.NODE_ENV === 'development' && { otp })
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('addresses')
      .populate('defaultAddress')
      .select('-otp');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, dateOfBirth, gender, preferences, healthProfile } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update allowed fields
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (gender !== undefined) user.gender = gender;

    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    if (healthProfile) {
      user.healthProfile = { ...user.healthProfile, ...healthProfile };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        preferences: user.preferences,
        healthProfile: user.healthProfile,
        rewardPoints: user.rewardPoints,
        membership: user.membership
      }
    });

  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Change phone number
// @route   POST /api/auth/change-phone
// @access  Private
exports.changePhoneNumber = async (req, res) => {
  try {
    const { newPhoneNumber } = req.body;

    // Check if new phone number is already in use
    const existingUser = await User.findOne({ phoneNumber: newPhoneNumber });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Phone number already in use'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate OTP for new phone number
    const tempUser = { phoneNumber: newPhoneNumber };
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP temporarily (in production, use Redis or similar)
    user.tempPhoneChange = {
      newPhoneNumber,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    };
    await user.save();

    // Send OTP to new phone number
    if (twilioClient) {
      try {
        await twilioClient.messages.create({
          body: `Your MediQuick phone change verification code is: ${otp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: newPhoneNumber
        });
      } catch (twilioError) {
        console.error('Twilio SMS Error:', twilioError);
      }
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to new phone number',
      ...(process.env.NODE_ENV === 'development' && { otp })
    });

  } catch (error) {
    console.error('Change Phone Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate phone change',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Verify phone change OTP
// @route   POST /api/auth/verify-phone-change
// @access  Private
exports.verifyPhoneChange = async (req, res) => {
  try {
    const { otp } = req.body;

    const user = await User.findById(req.user.id);
    if (!user || !user.tempPhoneChange) {
      return res.status(400).json({
        success: false,
        message: 'No phone change request found'
      });
    }

    // Check if OTP is expired
    if (new Date() > user.tempPhoneChange.expiresAt) {
      user.tempPhoneChange = undefined;
      await user.save();
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Verify OTP
    if (user.tempPhoneChange.otp !== otp) {
      return res.status(401).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Update phone number
    user.phoneNumber = user.tempPhoneChange.newPhoneNumber;
    user.tempPhoneChange = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Phone number updated successfully',
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Verify Phone Change Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify phone change',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // In a more complex setup, you might want to blacklist the token
    // For now, just clear the cookie
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 1 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/auth/delete-account
// @access  Private
exports.deleteAccount = async (req, res) => {
  try {
    const { confirmPassword } = req.body; // In a real app, you'd verify password

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete - mark as deleted instead of actually deleting
    user.isDeleted = true;
    user.status = 'suspended';
    user.deletedAt = new Date();
    await user.save();

    // Clear cookie
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 1 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete Account Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Google Sign-In
// @route   POST /api/auth/google
// @access  Public
exports.googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token is required'
      });
    }

    // Verify Google ID token
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });
    } catch (googleError) {
      console.error('Google token verification error:', googleError);
      return res.status(401).json({
        success: false,
        message: 'Invalid Google token'
      });
    }

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture, email_verified } = payload;

    if (!email_verified) {
      return res.status(400).json({
        success: false,
        message: 'Google account email not verified'
      });
    }

    // Check if user exists with this Google ID
    let user = await User.findOne({ googleId });

    if (user) {
      // User exists, log them in
      sendTokenResponse(user, 200, res, 'Google login successful');
    } else {
      // Check if user exists with this email
      user = await User.findOne({ email });

      if (user) {
        // Link Google account to existing user
        user.googleId = googleId;
        user.profileImage = user.profileImage || picture;
        user.isVerified = true; // Google verified email
        await user.save();

        sendTokenResponse(user, 200, res, 'Google account linked successfully');
      } else {
        // Create new user with Google account
        user = await User.create({
          name,
          email,
          googleId,
          profileImage: picture,
          isVerified: true, // Google verified email
          phoneNumber: null, // Will be updated later if needed
          authProvider: 'google',
          preferences: {
            notifications: {
              email: true,
              sms: false,
              push: true
            }
          }
        });

        sendTokenResponse(user, 201, res, 'Google account created successfully');
      }
    }

  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({
      success: false,
      message: 'Google authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Link phone number to Google account
// @route   POST /api/auth/google/link-phone
// @access  Private
exports.linkPhoneToGoogleAccount = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { phoneNumber } = req.body;

    // Check if phone number is already in use
    const existingUser = await User.findOne({ 
      phoneNumber, 
      _id: { $ne: req.user.id } 
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Phone number already in use'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate OTP for phone verification
    const otp = user.generateOTP();
    user.tempPhoneNumber = phoneNumber;
    await user.save();

    // Send OTP via SMS
    try {
      await smsService.sendOTP(phoneNumber, otp, 'phone-link');
    } catch (smsError) {
      console.error('SMS Error:', smsError.message);
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your phone number',
      ...(process.env.NODE_ENV === 'development' && { otp })
    });

  } catch (error) {
    console.error('Link Phone Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to link phone number',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Verify phone link OTP for Google account
// @route   POST /api/auth/google/verify-phone
// @access  Private
exports.verifyPhoneLink = async (req, res) => {
  try {
    const { otp } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify OTP
    if (!user.verifyOTP(otp)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Update phone number
    user.phoneNumber = user.tempPhoneNumber;
    user.tempPhoneNumber = undefined;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, 'Phone number linked successfully');

  } catch (error) {
    console.error('Verify Phone Link Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify phone number',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};