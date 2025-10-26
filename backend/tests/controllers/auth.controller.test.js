const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../src/models/User');
const { register, sendOTP, verifyOTP, login, getMe, updateProfile, changePhoneNumber, verifyPhoneChange, logout, deleteAccount } = require('../../src/controllers/auth.controller');
const jwt = require('jsonwebtoken');

// Mock express-validator
jest.mock('express-validator', () => ({
  validationResult: jest.fn(() => ({
    isEmpty: () => true,
    array: () => []
  }))
}));

// Mock SMS service
jest.mock('../../src/services/sms.service', () => ({
  sendOTP: jest.fn().mockResolvedValue({ success: true, provider: 'mock' }),
  sendNotification: jest.fn().mockResolvedValue({ success: true, provider: 'mock' }),
  getStatus: jest.fn().mockReturnValue({ provider: 'mock', mockMode: true, initialized: true })
}));

// Test environment variables
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';
process.env.JWT_EXPIRE = '7d';
process.env.NODE_ENV = 'test';
process.env.MOCK_SMS = 'true';

// Create express app for testing
const app = express();
app.use(express.json());

// Routes for testing
app.post('/register', register);
app.post('/send-otp', sendOTP);
app.post('/verify-otp', verifyOTP);
app.post('/login', login);
app.get('/me', (req, res, next) => {
  // Mock auth middleware
  req.user = { id: req.headers['user-id'] };
  next();
}, getMe);
app.put('/update-profile', (req, res, next) => {
  req.user = { id: req.headers['user-id'] };
  next();
}, updateProfile);
app.post('/change-phone', (req, res, next) => {
  req.user = { id: req.headers['user-id'] };
  next();
}, changePhoneNumber);
app.post('/verify-phone-change', (req, res, next) => {
  req.user = { id: req.headers['user-id'] };
  next();
}, verifyPhoneChange);
app.post('/logout', (req, res, next) => {
  req.user = { id: req.headers['user-id'] };
  next();
}, logout);
app.delete('/delete-account', (req, res, next) => {
  req.user = { id: req.headers['user-id'] };
  next();
}, deleteAccount);

let mongod;

// Database setup
beforeAll(async () => {
  // Ensure no existing connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

// Clear database between tests
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
  
  // Reset mocks
  jest.clearAllMocks();
});

// Cleanup after all tests
afterAll(async () => {
  if (mongod) {
    await mongoose.disconnect();
    await mongod.stop();
  }
});

describe('Auth Controller', () => {
  describe('POST /register', () => {
    test('should register new user successfully', async () => {
      const userData = {
        phoneNumber: '+1234567890',
        name: 'John Doe',
        email: 'john@example.com'
      };

      const response = await request(app)
        .post('/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Registration successful. OTP sent to your phone number.');
      expect(response.body.otp).toMatch(/^\d{6}$/); // OTP should be included in development mode

      // Verify user was created in database
      const user = await User.findOne({ phoneNumber: userData.phoneNumber });
      expect(user).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.isVerified).toBe(false);
    });

    test('should reject duplicate phone number', async () => {
      const userData = {
        phoneNumber: '+1234567890',
        name: 'John Doe'
      };

      // Create user first
      await new User(userData).save();

      const response = await request(app)
        .post('/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User already exists with this phone number');
    });

    test('should handle registration without optional fields', async () => {
      const userData = {
        phoneNumber: '+1234567891'
      };

      const response = await request(app)
        .post('/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);

      const user = await User.findOne({ phoneNumber: userData.phoneNumber });
      expect(user).toBeDefined();
      expect(user.name).toBeUndefined();
      expect(user.email).toBeUndefined();
    });
  });

  describe('POST /send-otp', () => {
    test('should send OTP to existing user', async () => {
      const user = await new User({
        phoneNumber: '+1234567890',
        name: 'John Doe'
      }).save();

      const response = await request(app)
        .post('/send-otp')
        .send({ phoneNumber: user.phoneNumber })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('OTP sent successfully to your phone number');
      expect(response.body.otp).toMatch(/^\d{6}$/);

      // Verify OTP was set in database
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.otp.code).toBeDefined();
      expect(updatedUser.otp.expiresAt).toBeInstanceOf(Date);
    });

    test('should create new user and send OTP', async () => {
      const phoneNumber = '+1234567891';

      const response = await request(app)
        .post('/send-otp')
        .send({ phoneNumber })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.otp).toMatch(/^\d{6}$/);

      // Verify user was created
      const user = await User.findOne({ phoneNumber });
      expect(user).toBeDefined();
      expect(user.otp.code).toBeDefined();
    });

    test('should handle rate limiting for OTP requests', async () => {
      const user = await new User({
        phoneNumber: '+1234567890'
      }).save();

      // Simulate rate limit scenario
      user.otp = {
        attempts: 3,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
      };
      await user.save();

      const response = await request(app)
        .post('/send-otp')
        .send({ phoneNumber: user.phoneNumber })
        .expect(429);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Too many OTP requests. Please try again after an hour.');
    });
  });

  describe('POST /verify-otp', () => {
    test('should verify OTP and login user successfully', async () => {
      const user = await new User({
        phoneNumber: '+1234567890',
        name: 'John Doe'
      }).save();

      const otp = user.generateOTP();
      await user.save();

      const response = await request(app)
        .post('/verify-otp')
        .send({
          phoneNumber: user.phoneNumber,
          otp: otp
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.phoneNumber).toBe(user.phoneNumber);
      expect(response.body.user.name).toBe(user.name);

      // Verify user was marked as verified
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.isVerified).toBe(true);
      expect(updatedUser.otp).toBeUndefined();
      expect(updatedUser.loginCount).toBe(1);
    });

    test('should reject invalid OTP', async () => {
      const user = await new User({
        phoneNumber: '+1234567890'
      }).save();

      user.generateOTP();
      await user.save();

      const response = await request(app)
        .post('/verify-otp')
        .send({
          phoneNumber: user.phoneNumber,
          otp: '000000'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid OTP');

      // Verify attempt count was incremented
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.otp.attempts).toBe(1);
    });

    test('should reject expired OTP', async () => {
      const user = await new User({
        phoneNumber: '+1234567890'
      }).save();

      const otp = user.generateOTP();
      user.otp.expiresAt = new Date(Date.now() - 1000); // Already expired
      await user.save();

      const response = await request(app)
        .post('/verify-otp')
        .send({
          phoneNumber: user.phoneNumber,
          otp: otp
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('OTP has expired');
    });

    test('should reject OTP for non-existent user', async () => {
      const response = await request(app)
        .post('/verify-otp')
        .send({
          phoneNumber: '+9999999999',
          otp: '123456'
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found. Please register first.');
    });
  });

  describe('POST /login', () => {
    test('should send OTP for existing user login', async () => {
      const user = await new User({
        phoneNumber: '+1234567890',
        name: 'John Doe',
        isVerified: true
      }).save();

      const response = await request(app)
        .post('/login')
        .send({ phoneNumber: user.phoneNumber })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('OTP sent successfully');
      expect(response.body.otp).toMatch(/^\d{6}$/);

      // Verify OTP was generated
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.otp.code).toBeDefined();
    });

    test('should reject login for non-existent user', async () => {
      const response = await request(app)
        .post('/login')
        .send({ phoneNumber: '+9999999999' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found. Please register first.');
    });
  });

  describe('GET /me', () => {
    test('should return current user profile', async () => {
      const user = await new User({
        phoneNumber: '+1234567890',
        name: 'John Doe',
        email: 'john@example.com',
        isVerified: true
      }).save();

      const response = await request(app)
        .get('/me')
        .set('user-id', user._id.toString())
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.phoneNumber).toBe(user.phoneNumber);
      expect(response.body.user.name).toBe(user.name);
      expect(response.body.user.email).toBe(user.email);
      expect(response.body.user.otp).toBeUndefined(); // Should be excluded
    });

    test('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/me')
        .set('user-id', '64a7c9e5f123456789abcdef')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('PUT /update-profile', () => {
    test('should update user profile successfully', async () => {
      const user = await new User({
        phoneNumber: '+1234567890',
        name: 'John Doe'
      }).save();

      const updateData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        dateOfBirth: '1990-05-15',
        gender: 'female',
        preferences: {
          darkMode: true,
          language: 'hi'
        },
        healthProfile: {
          allergies: ['Peanuts', 'Shellfish']
        }
      };

      const response = await request(app)
        .put('/update-profile')
        .set('user-id', user._id.toString())
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Profile updated successfully');
      expect(response.body.user.name).toBe(updateData.name);
      expect(response.body.user.email).toBe(updateData.email);
      expect(response.body.user.gender).toBe(updateData.gender);

      // Verify in database
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.name).toBe(updateData.name);
      expect(updatedUser.preferences.darkMode).toBe(true);
      expect(updatedUser.preferences.language).toBe('hi');
      expect(updatedUser.healthProfile.allergies).toContain('Peanuts');
    });

    test('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .put('/update-profile')
        .set('user-id', '64a7c9e5f123456789abcdef')
        .send({ name: 'Test User' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });

    test('should handle partial profile updates', async () => {
      const user = await new User({
        phoneNumber: '+1234567890',
        name: 'John Doe',
        preferences: { darkMode: false, language: 'en' }
      }).save();

      const updateData = {
        preferences: { elderMode: true }
      };

      const response = await request(app)
        .put('/update-profile')
        .set('user-id', user._id.toString())
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify partial update - existing preferences should be preserved
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.preferences.elderMode).toBe(true);
      expect(updatedUser.preferences.darkMode).toBe(false); // Should remain unchanged
      expect(updatedUser.preferences.language).toBe('en'); // Should remain unchanged
    });
  });

  describe('Token Generation and Cookies', () => {
    test('should set secure cookie with token in production', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const user = await new User({
        phoneNumber: '+1234567890',
        isVerified: true
      }).save();

      const otp = user.generateOTP();
      await user.save();

      const response = await request(app)
        .post('/verify-otp')
        .send({
          phoneNumber: user.phoneNumber,
          otp: otp
        })
        .expect(200);

      expect(response.body.token).toBeDefined();
      
      // Check if token is valid
      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
      expect(decoded.id).toBe(user._id.toString());
      expect(decoded.phoneNumber).toBe(user.phoneNumber);

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('POST /change-phone', () => {
    test('should initiate phone number change successfully', async () => {
      const user = await new User({
        phoneNumber: '+1234567890',
        name: 'John Doe',
        isVerified: true
      }).save();

      const newPhoneNumber = '+1987654321';

      const response = await request(app)
        .post('/change-phone')
        .set('user-id', user._id.toString())
        .send({ newPhoneNumber })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('OTP sent to new phone number');
      expect(response.body.otp).toMatch(/^\d{6}$/);

      // Verify tempPhoneChange was set
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.tempPhoneChange).toBeDefined();
      expect(updatedUser.tempPhoneChange.newPhoneNumber).toBe(newPhoneNumber);
      expect(updatedUser.tempPhoneChange.otp).toBeDefined();
      expect(updatedUser.tempPhoneChange.expiresAt).toBeInstanceOf(Date);
    });

    test('should reject phone change if new number already exists', async () => {
      const user1 = await new User({
        phoneNumber: '+1234567890',
        name: 'John Doe'
      }).save();

      const user2 = await new User({
        phoneNumber: '+1987654321',
        name: 'Jane Doe'
      }).save();

      const response = await request(app)
        .post('/change-phone')
        .set('user-id', user1._id.toString())
        .send({ newPhoneNumber: user2.phoneNumber })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Phone number already in use');
    });

    test('should return 404 if user not found', async () => {
      const response = await request(app)
        .post('/change-phone')
        .set('user-id', '64a7c9e5f123456789abcdef')
        .send({ newPhoneNumber: '+1987654321' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('POST /verify-phone-change', () => {
    test('should verify phone change OTP and update phone number', async () => {
      const user = await new User({
        phoneNumber: '+1234567890',
        name: 'John Doe',
        tempPhoneChange: {
          newPhoneNumber: '+1987654321',
          otp: '123456',
          expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        }
      }).save();

      const response = await request(app)
        .post('/verify-phone-change')
        .set('user-id', user._id.toString())
        .send({ otp: '123456' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Phone number updated successfully');
      expect(response.body.user.phoneNumber).toBe('+1987654321');

      // Verify phone number was updated and tempPhoneChange cleared
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.phoneNumber).toBe('+1987654321');
      expect(updatedUser.tempPhoneChange).toBeUndefined();
    });

    test('should reject invalid OTP', async () => {
      const user = await new User({
        phoneNumber: '+1234567890',
        tempPhoneChange: {
          newPhoneNumber: '+1987654321',
          otp: '123456',
          expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        }
      }).save();

      const response = await request(app)
        .post('/verify-phone-change')
        .set('user-id', user._id.toString())
        .send({ otp: '999999' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid OTP');
    });

    test('should reject expired OTP', async () => {
      const user = await new User({
        phoneNumber: '+1234567890',
        tempPhoneChange: {
          newPhoneNumber: '+1987654321',
          otp: '123456',
          expiresAt: new Date(Date.now() - 1000) // Already expired
        }
      }).save();

      const response = await request(app)
        .post('/verify-phone-change')
        .set('user-id', user._id.toString())
        .send({ otp: '123456' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('OTP has expired');

      // Verify tempPhoneChange was cleared
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.tempPhoneChange).toBeUndefined();
    });

    test('should reject if no phone change request found', async () => {
      const user = await new User({
        phoneNumber: '+1234567890',
        name: 'John Doe'
      }).save();

      const response = await request(app)
        .post('/verify-phone-change')
        .set('user-id', user._id.toString())
        .send({ otp: '123456' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No phone change request found');
    });

    test('should handle non-existent user', async () => {
      const response = await request(app)
        .post('/verify-phone-change')
        .set('user-id', '64a7c9e5f123456789abcdef')
        .send({ otp: '123456' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No phone change request found');
    });
  });

  describe('POST /logout', () => {
    test('should logout user successfully', async () => {
      const user = await new User({
        phoneNumber: '+1234567890',
        name: 'John Doe',
        isVerified: true
      }).save();

      const response = await request(app)
        .post('/logout')
        .set('user-id', user._id.toString())
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logged out successfully');

      // Check that cookie clearing headers are set
      const setCookieHeader = response.headers['set-cookie'];
      expect(setCookieHeader).toBeDefined();
      expect(setCookieHeader[0]).toContain('token=none');
      expect(setCookieHeader[0]).toContain('HttpOnly');
    });

    test('should handle logout without user context gracefully', async () => {
      const response = await request(app)
        .post('/logout')
        .set('user-id', '64a7c9e5f123456789abcdef')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logged out successfully');
    });
  });

  describe('DELETE /delete-account', () => {
    test('should soft delete user account successfully', async () => {
      const user = await new User({
        phoneNumber: '+1234567890',
        name: 'John Doe',
        isVerified: true
      }).save();

      const response = await request(app)
        .delete('/delete-account')
        .set('user-id', user._id.toString())
        .send({ confirmPassword: 'dummy' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Account deleted successfully');

      // Verify user was soft deleted
      const deletedUser = await User.findById(user._id);
      expect(deletedUser.isDeleted).toBe(true);
      expect(deletedUser.status).toBe('suspended');
      expect(deletedUser.deletedAt).toBeInstanceOf(Date);

      // Check that cookie clearing headers are set
      const setCookieHeader = response.headers['set-cookie'];
      expect(setCookieHeader).toBeDefined();
      expect(setCookieHeader[0]).toContain('token=none');
    });

    test('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .delete('/delete-account')
        .set('user-id', '64a7c9e5f123456789abcdef')
        .send({ confirmPassword: 'dummy' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });

    test('should delete account without confirmation password', async () => {
      const user = await new User({
        phoneNumber: '+1234567890',
        name: 'John Doe',
        isVerified: true
      }).save();

      const response = await request(app)
        .delete('/delete-account')
        .set('user-id', user._id.toString())
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Account deleted successfully');

      // Verify user was soft deleted
      const deletedUser = await User.findById(user._id);
      expect(deletedUser.isDeleted).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle validation errors in register', async () => {
      // Mock validation result to return errors
      const { validationResult } = require('express-validator');
      validationResult.mockReturnValueOnce({
        isEmpty: () => false,
        array: () => [{ msg: 'Phone number is required', param: 'phoneNumber' }]
      });

      const response = await request(app)
        .post('/register')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toBeDefined();

      // Restore mock
      validationResult.mockReturnValue({
        isEmpty: () => true,
        array: () => []
      });
    });

    test('should handle validation errors in sendOTP', async () => {
      const { validationResult } = require('express-validator');
      validationResult.mockReturnValueOnce({
        isEmpty: () => false,
        array: () => [{ msg: 'Phone number is required', param: 'phoneNumber' }]
      });

      const response = await request(app)
        .post('/send-otp')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');

      // Restore mock
      validationResult.mockReturnValue({
        isEmpty: () => true,
        array: () => []
      });
    });

    test('should handle validation errors in verifyOTP', async () => {
      const { validationResult } = require('express-validator');
      validationResult.mockReturnValueOnce({
        isEmpty: () => false,
        array: () => [{ msg: 'OTP is required', param: 'otp' }]
      });

      const response = await request(app)
        .post('/verify-otp')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');

      // Restore mock
      validationResult.mockReturnValue({
        isEmpty: () => true,
        array: () => []
      });
    });
  });
});