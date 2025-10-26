const request = require('supertest');
const express = require('express');

// Mock the User model before importing
jest.mock('../../src/models/User', () => ({
  findById: jest.fn().mockImplementation(() => ({
    populate: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis()
  }))
}));

const User = require('../../src/models/User');
const { getProfile, updatePreferences, getRewardPoints } = require('../../src/controllers/user.controller');

// Create express app for testing
const app = express();
app.use(express.json());

// Mock auth middleware
const mockAuth = (req, res, next) => {
  req.user = { id: req.headers['user-id'] || '64a7c9e5f123456789abcdef' };
  next();
};

// Routes for testing
app.get('/profile', mockAuth, getProfile);
app.put('/preferences', mockAuth, updatePreferences);
app.get('/reward-points', mockAuth, getRewardPoints);

describe('User Controller', () => {
  let userId;
  let mockUser;

  beforeEach(() => {
    userId = '64a7c9e5f123456789abcdef';
    
    mockUser = {
      _id: userId,
      phoneNumber: '+1234567890',
      name: 'John Doe',
      email: 'john@example.com',
      isVerified: true,
      preferences: {
        elderMode: false,
        darkMode: false,
        language: 'en',
        notifications: {
          orderUpdates: true,
          offers: true,
          reminders: true
        }
      },
      rewardPoints: {
        current: 150,
        total: 500,
        used: 350
      },
      addresses: [],
      defaultAddress: null,
      save: jest.fn()
    };

    jest.clearAllMocks();
  });

  describe('GET /profile', () => {
    test('should get user profile successfully', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(mockUser)
      };

      jest.spyOn(User, 'findById').mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/profile')
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user._id).toBe(userId);
      expect(response.body.user.phoneNumber).toBe('+1234567890');
      
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(mockQuery.populate).toHaveBeenCalledWith('addresses');
      expect(mockQuery.populate).toHaveBeenCalledWith('defaultAddress');
      expect(mockQuery.select).toHaveBeenCalledWith('-otp');
    });

    test('should handle user with populated addresses', async () => {
      const userWithAddresses = {
        ...mockUser,
        addresses: [
          {
            _id: '64a7c9e5f123456789abcde1',
            label: 'Home',
            addressLine1: '123 Main St',
            city: 'New York',
            isDefault: true
          }
        ],
        defaultAddress: {
          _id: '64a7c9e5f123456789abcde1',
          label: 'Home',
          addressLine1: '123 Main St'
        }
      };

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(userWithAddresses)
      };

      jest.spyOn(User, 'findById').mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/profile')
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.addresses).toHaveLength(1);
      expect(response.body.user.defaultAddress).toBeDefined();
      expect(response.body.user.defaultAddress.label).toBe('Home');
    });

    test('should handle database errors', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      jest.spyOn(User, 'findById').mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/profile')
        .set('user-id', userId)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to get profile');
    });

    test('should exclude OTP from response', async () => {
      const userWithOTP = {
        ...mockUser,
        otp: {
          code: '123456',
          expiresAt: new Date(),
          attempts: 0
        }
      };

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(mockUser) // OTP should be excluded by select
      };

      jest.spyOn(User, 'findById').mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/profile')
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.otp).toBeUndefined();
      expect(mockQuery.select).toHaveBeenCalledWith('-otp');
    });
  });

  describe('PUT /preferences', () => {
    test('should update all preference fields successfully', async () => {
      jest.spyOn(User, 'findById').mockResolvedValue(mockUser);

      const updateData = {
        elderMode: true,
        darkMode: true,
        language: 'hi',
        notifications: {
          orderUpdates: false,
          offers: true,
          reminders: false
        }
      };

      const response = await request(app)
        .put('/preferences')
        .set('user-id', userId)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Preferences updated successfully');
      expect(response.body.preferences).toBeDefined();
      
      expect(mockUser.preferences.elderMode).toBe(true);
      expect(mockUser.preferences.darkMode).toBe(true);
      expect(mockUser.preferences.language).toBe('hi');
      expect(mockUser.preferences.notifications.orderUpdates).toBe(false);
      expect(mockUser.preferences.notifications.offers).toBe(true);
      expect(mockUser.preferences.notifications.reminders).toBe(false);
      expect(mockUser.save).toHaveBeenCalled();
    });

    test('should update partial preferences', async () => {
      jest.spyOn(User, 'findById').mockResolvedValue(mockUser);

      const updateData = {
        elderMode: true
      };

      const response = await request(app)
        .put('/preferences')
        .set('user-id', userId)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockUser.preferences.elderMode).toBe(true);
      expect(mockUser.preferences.darkMode).toBe(false); // Should remain unchanged
      expect(mockUser.preferences.language).toBe('en'); // Should remain unchanged
      expect(mockUser.save).toHaveBeenCalled();
    });

    test('should merge notification preferences', async () => {
      const userWithExistingNotifications = {
        ...mockUser,
        preferences: {
          ...mockUser.preferences,
          notifications: {
            orderUpdates: true,
            offers: false,
            reminders: true,
            newsletter: false // Additional existing field
          }
        }
      };

      jest.spyOn(User, 'findById').mockResolvedValue(userWithExistingNotifications);

      const updateData = {
        notifications: {
          offers: true,
          reminders: false
        }
      };

      const response = await request(app)
        .put('/preferences')
        .set('user-id', userId)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(userWithExistingNotifications.preferences.notifications.orderUpdates).toBe(true); // Unchanged
      expect(userWithExistingNotifications.preferences.notifications.offers).toBe(true); // Updated
      expect(userWithExistingNotifications.preferences.notifications.reminders).toBe(false); // Updated
      expect(userWithExistingNotifications.preferences.notifications.newsletter).toBe(false); // Unchanged
    });

    test('should handle boolean values correctly', async () => {
      jest.spyOn(User, 'findById').mockResolvedValue(mockUser);

      const updateData = {
        elderMode: false,
        darkMode: true
      };

      const response = await request(app)
        .put('/preferences')
        .set('user-id', userId)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockUser.preferences.elderMode).toBe(false);
      expect(mockUser.preferences.darkMode).toBe(true);
    });

    test('should ignore undefined values', async () => {
      const originalPreferences = { ...mockUser.preferences };
      jest.spyOn(User, 'findById').mockResolvedValue(mockUser);

      const updateData = {
        elderMode: undefined,
        darkMode: true,
        language: undefined
      };

      const response = await request(app)
        .put('/preferences')
        .set('user-id', userId)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockUser.preferences.elderMode).toBe(originalPreferences.elderMode); // Should remain unchanged
      expect(mockUser.preferences.darkMode).toBe(true); // Should be updated
      expect(mockUser.preferences.language).toBe(originalPreferences.language); // Should remain unchanged
    });

    test('should return 404 for non-existent user', async () => {
      jest.spyOn(User, 'findById').mockResolvedValue(null);

      const updateData = {
        elderMode: true
      };

      const response = await request(app)
        .put('/preferences')
        .set('user-id', 'non-existent-user-id')
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });

    test('should handle save errors', async () => {
      const userWithSaveError = {
        ...mockUser,
        save: jest.fn().mockRejectedValue(new Error('Save failed'))
      };

      jest.spyOn(User, 'findById').mockResolvedValue(userWithSaveError);

      const updateData = {
        elderMode: true
      };

      const response = await request(app)
        .put('/preferences')
        .set('user-id', userId)
        .send(updateData)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to update preferences');
    });

    test('should handle database errors', async () => {
      jest.spyOn(User, 'findById').mockRejectedValue(new Error('Database error'));

      const updateData = {
        elderMode: true
      };

      const response = await request(app)
        .put('/preferences')
        .set('user-id', userId)
        .send(updateData)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to update preferences');
    });

    test('should handle empty update data', async () => {
      const originalPreferences = { ...mockUser.preferences };
      jest.spyOn(User, 'findById').mockResolvedValue(mockUser);

      const response = await request(app)
        .put('/preferences')
        .set('user-id', userId)
        .send({})
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockUser.preferences).toEqual(originalPreferences);
      expect(mockUser.save).toHaveBeenCalled();
    });
  });

  describe('GET /reward-points', () => {
    test('should get reward points successfully', async () => {
      const mockQuery = {
        select: jest.fn().mockResolvedValue({
          _id: userId,
          rewardPoints: mockUser.rewardPoints
        })
      };

      jest.spyOn(User, 'findById').mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/reward-points')
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.rewardPoints).toBeDefined();
      expect(response.body.rewardPoints.current).toBe(150);
      expect(response.body.rewardPoints.total).toBe(500);
      expect(response.body.rewardPoints.used).toBe(350);
      
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(mockQuery.select).toHaveBeenCalledWith('rewardPoints');
    });

    test('should handle user with zero reward points', async () => {
      const userWithZeroPoints = {
        _id: userId,
        rewardPoints: {
          current: 0,
          total: 0,
          used: 0
        }
      };

      const mockQuery = {
        select: jest.fn().mockResolvedValue(userWithZeroPoints)
      };

      jest.spyOn(User, 'findById').mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/reward-points')
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.rewardPoints.current).toBe(0);
      expect(response.body.rewardPoints.total).toBe(0);
      expect(response.body.rewardPoints.used).toBe(0);
    });

    test('should handle user with high reward points', async () => {
      const userWithHighPoints = {
        _id: userId,
        rewardPoints: {
          current: 99999,
          total: 150000,
          used: 50001
        }
      };

      const mockQuery = {
        select: jest.fn().mockResolvedValue(userWithHighPoints)
      };

      jest.spyOn(User, 'findById').mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/reward-points')
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.rewardPoints.current).toBe(99999);
      expect(response.body.rewardPoints.total).toBe(150000);
      expect(response.body.rewardPoints.used).toBe(50001);
    });

    test('should handle database errors', async () => {
      const mockQuery = {
        select: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      jest.spyOn(User, 'findById').mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/reward-points')
        .set('user-id', userId)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to get reward points');
    });

    test('should handle user not found gracefully', async () => {
      const mockQuery = {
        select: jest.fn().mockResolvedValue(null)
      };

      jest.spyOn(User, 'findById').mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/reward-points')
        .set('user-id', 'non-existent-user-id')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to get reward points');
    });

    test('should only select reward points field', async () => {
      const mockQuery = {
        select: jest.fn().mockResolvedValue({
          _id: userId,
          rewardPoints: mockUser.rewardPoints
          // Should not include other fields like name, email, etc.
        })
      };

      jest.spyOn(User, 'findById').mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/reward-points')
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.rewardPoints).toBeDefined();
      expect(response.body.user).toBeUndefined(); // Should not have user object
      expect(mockQuery.select).toHaveBeenCalledWith('rewardPoints');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});