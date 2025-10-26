const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');

describe('User Model', () => {
  describe('User Schema Validation', () => {
    test('should create user with valid phone number', async () => {
      const userData = {
        phoneNumber: '+1234567890',
        name: 'John Doe',
        email: 'john@example.com'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.phoneNumber).toBe(userData.phoneNumber);
      expect(savedUser.name).toBe(userData.name);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.isVerified).toBe(false);
      expect(savedUser.rewardPoints).toBe(0);
      expect(savedUser.membership).toBe('regular');
    });

    test('should require phone number', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      const user = new User(userData);

      await expect(user.save()).rejects.toThrow('Phone number is required');
    });

    test('should validate phone number format', async () => {
      const userData = {
        phoneNumber: 'invalid-phone',
        name: 'John Doe'
      };

      const user = new User(userData);

      await expect(user.save()).rejects.toThrow('Please enter a valid phone number');
    });

    test('should validate email format', async () => {
      const userData = {
        phoneNumber: '+1234567890',
        name: 'John Doe',
        email: 'invalid-email'
      };

      const user = new User(userData);

      await expect(user.save()).rejects.toThrow('Please enter a valid email address');
    });

    test('should enforce unique phone number', async () => {
      const userData = {
        phoneNumber: '+1234567890',
        name: 'John Doe'
      };

      await new User(userData).save();

      const duplicateUser = new User(userData);
      await expect(duplicateUser.save()).rejects.toThrow();
    });

    test('should validate gender enum', async () => {
      const userData = {
        phoneNumber: '+1234567890',
        gender: 'invalid-gender'
      };

      const user = new User(userData);

      await expect(user.save()).rejects.toThrow();
    });

    test('should validate membership enum', async () => {
      const userData = {
        phoneNumber: '+1234567890',
        membership: 'invalid-membership'
      };

      const user = new User(userData);

      await expect(user.save()).rejects.toThrow();
    });
  });

  describe('Virtual Properties', () => {
    test('should return full name when name exists', () => {
      const user = new User({
        phoneNumber: '+1234567890',
        name: 'John Doe'
      });

      expect(user.fullName).toBe('John Doe');
    });

    test('should return formatted phone number when name does not exist', () => {
      const user = new User({
        phoneNumber: '+1234567890'
      });

      expect(user.fullName).toBe('User +1234567890');
    });

    test('should check membership active status', () => {
      const user = new User({
        phoneNumber: '+1234567890',
        membership: 'regular'
      });

      expect(user.isMembershipActive).toBe(true);
    });

    test('should check membership expiry', () => {
      const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const pastDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const activeUser = new User({
        phoneNumber: '+1234567890',
        membership: 'premium',
        membershipExpiry: futureDate
      });

      const expiredUser = new User({
        phoneNumber: '+1234567891',
        membership: 'premium',
        membershipExpiry: pastDate
      });

      expect(activeUser.isMembershipActive).toBe(true);
      expect(expiredUser.isMembershipActive).toBe(false);
    });
  });

  describe('OTP Methods', () => {
    test('should generate valid OTP', () => {
      const user = new User({
        phoneNumber: '+1234567890'
      });

      const otp = user.generateOTP();

      expect(otp).toMatch(/^\d{6}$/);
      expect(user.otp.code).toBe(otp);
      expect(user.otp.attempts).toBe(0);
      expect(user.otp.expiresAt).toBeInstanceOf(Date);
      expect(user.otp.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    test('should verify valid OTP', () => {
      const user = new User({
        phoneNumber: '+1234567890'
      });

      const otp = user.generateOTP();
      const result = user.verifyOTP(otp);

      expect(result.success).toBe(true);
      expect(result.message).toBe('OTP verified successfully');
    });

    test('should reject invalid OTP', () => {
      const user = new User({
        phoneNumber: '+1234567890'
      });

      user.generateOTP();
      const result = user.verifyOTP('000000');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid OTP');
      expect(user.otp.attempts).toBe(1);
    });

    test('should reject expired OTP', () => {
      const user = new User({
        phoneNumber: '+1234567890'
      });

      user.generateOTP();
      // Manually expire the OTP
      user.otp.expiresAt = new Date(Date.now() - 1000);

      const result = user.verifyOTP(user.otp.code);

      expect(result.success).toBe(false);
      expect(result.message).toBe('OTP has expired');
    });

    test('should block after 3 failed attempts', () => {
      const user = new User({
        phoneNumber: '+1234567890'
      });

      user.generateOTP();

      // Make 3 failed attempts
      user.verifyOTP('000000');
      user.verifyOTP('000000');
      user.verifyOTP('000000');

      const result = user.verifyOTP('000000');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Too many attempts. Please request a new OTP');
    });

    test('should reject OTP verification when no OTP exists', () => {
      const user = new User({
        phoneNumber: '+1234567890'
      });

      const result = user.verifyOTP('123456');

      expect(result.success).toBe(false);
      expect(result.message).toBe('No OTP found');
    });
  });

  describe('JWT Token Methods', () => {
    test('should generate valid JWT token', () => {
      const user = new User({
        phoneNumber: '+1234567890',
        _id: '64a7c9e5f123456789abcdef'
      });

      const token = user.generateToken();

      expect(typeof token).toBe('string');
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe(user._id.toString());
      expect(decoded.phoneNumber).toBe(user.phoneNumber);
    });
  });

  describe('Reward Points Methods', () => {
    test('should add reward points', async () => {
      const userData = {
        phoneNumber: '+1234567890',
        rewardPoints: 100
      };

      const user = await new User(userData).save();
      await user.addRewardPoints(50);

      expect(user.rewardPoints).toBe(150);
    });

    test('should deduct reward points', async () => {
      const userData = {
        phoneNumber: '+1234567890',
        rewardPoints: 100
      };

      const user = await new User(userData).save();
      await user.deductRewardPoints(30);

      expect(user.rewardPoints).toBe(70);
    });

    test('should throw error when insufficient reward points', async () => {
      const userData = {
        phoneNumber: '+1234567890',
        rewardPoints: 50
      };

      const user = await new User(userData).save();

      await expect(user.deductRewardPoints(100))
        .rejects
        .toThrow('Insufficient reward points');
    });
  });

  describe('Activity Methods', () => {
    test('should update activity and login count', async () => {
      const userData = {
        phoneNumber: '+1234567890',
        loginCount: 5
      };

      const user = await new User(userData).save();
      const originalLastActivity = user.lastActivity;

      // Wait a moment to ensure time difference
      await new Promise(resolve => setTimeout(resolve, 10));
      
      await user.updateActivity();

      expect(user.loginCount).toBe(6);
      expect(user.lastActivity.getTime()).toBeGreaterThan(originalLastActivity.getTime());
    });
  });

  describe('JSON Serialization', () => {
    test('should exclude sensitive data from JSON', () => {
      const user = new User({
        phoneNumber: '+1234567890',
        name: 'John Doe'
      });

      user.generateOTP();
      const json = user.toJSON();

      expect(json.otp).toBeUndefined();
      expect(json.__v).toBeUndefined();
      expect(json.phoneNumber).toBe('+1234567890');
      expect(json.name).toBe('John Doe');
    });
  });

  describe('Pre-save Middleware', () => {
    test('should update lastActivity on save', async () => {
      const user = new User({
        phoneNumber: '+1234567890'
      });

      const originalTime = user.lastActivity;
      
      // Wait a moment to ensure time difference
      await new Promise(resolve => setTimeout(resolve, 10));
      
      await user.save();

      expect(user.lastActivity.getTime()).toBeGreaterThan(originalTime.getTime());
    });
  });

  describe('Default Values', () => {
    test('should set default values correctly', () => {
      const user = new User({
        phoneNumber: '+1234567890'
      });

      expect(user.isVerified).toBe(false);
      expect(user.rewardPoints).toBe(0);
      expect(user.membership).toBe('regular');
      expect(user.status).toBe('active');
      expect(user.isDeleted).toBe(false);
      expect(user.totalOrders).toBe(0);
      expect(user.totalSpent).toBe(0);
      expect(user.loginCount).toBe(0);
      expect(user.preferences.elderMode).toBe(false);
      expect(user.preferences.darkMode).toBe(false);
      expect(user.preferences.language).toBe('en');
    });
  });
});