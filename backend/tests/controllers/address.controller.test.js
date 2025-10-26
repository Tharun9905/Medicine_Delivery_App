const request = require('supertest');
const express = require('express');

// Mock the Address model before importing
jest.mock('../../src/models/Address', () => {
  const mockModel = jest.fn();
  mockModel.find = jest.fn();
  mockModel.findOne = jest.fn();
  mockModel.findOneAndUpdate = jest.fn();
  return mockModel;
});

const Address = require('../../src/models/Address');
const { 
  getAddresses, 
  addAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress 
} = require('../../src/controllers/address.controller');

// Create express app for testing
const app = express();
app.use(express.json());

// Mock auth middleware
const mockAuth = (req, res, next) => {
  req.user = { id: req.headers['user-id'] || '64a7c9e5f123456789abcdef' };
  next();
};

// Routes for testing
app.get('/addresses', mockAuth, getAddresses);
app.post('/addresses', mockAuth, addAddress);
app.put('/addresses/:id', mockAuth, updateAddress);
app.delete('/addresses/:id', mockAuth, deleteAddress);
app.put('/addresses/:id/default', mockAuth, setDefaultAddress);

describe('Address Controller', () => {
  let userId;
  let mockAddress;

  beforeEach(() => {
    userId = '64a7c9e5f123456789abcdef';
    
    mockAddress = {
      _id: '64a7c9e5f123456789abcde1',
      user: userId,
      label: 'Home',
      addressLine1: '123 Main St',
      addressLine2: 'Apt 1',
      city: 'New York',
      state: 'NY',
      pincode: '10001',
      isDefault: false,
      isActive: true,
      usageCount: 5,
      location: {
        coordinates: [-73.935242, 40.730610]
      }
    };
  });

  describe('GET /addresses', () => {
    test('should get all user addresses successfully', async () => {
      const mockAddresses = [
        { ...mockAddress, isDefault: true, usageCount: 10 },
        { ...mockAddress, _id: '64a7c9e5f123456789abcde2', label: 'Office', isDefault: false, usageCount: 3 }
      ];

      const mockQuery = {
        sort: jest.fn().mockResolvedValue(mockAddresses)
      };

      jest.spyOn(Address, 'find').mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/addresses')
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.addresses).toHaveLength(2);
      expect(Address.find).toHaveBeenCalledWith({ user: userId, isActive: true });
      expect(mockQuery.sort).toHaveBeenCalledWith({ isDefault: -1, usageCount: -1 });
    });

    test('should return empty array when no addresses found', async () => {
      const mockQuery = {
        sort: jest.fn().mockResolvedValue([])
      };

      jest.spyOn(Address, 'find').mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/addresses')
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.addresses).toHaveLength(0);
    });

    test('should handle database errors', async () => {
      const mockQuery = {
        sort: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      jest.spyOn(Address, 'find').mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/addresses')
        .set('user-id', userId)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to get addresses');
    });
  });

  describe('POST /addresses', () => {
    test('should add address successfully', async () => {
      const addressData = {
        label: 'Office',
        addressLine1: '456 Business Ave',
        city: 'New York',
        state: 'NY',
        pincode: '10002',
        contactName: 'John Doe',
        contactPhone: '+1234567890'
      };

      const mockSavedAddress = { ...addressData, _id: '64a7c9e5f123456789abcde2', user: userId };
      const mockSave = jest.fn().mockResolvedValue(mockSavedAddress);
      
      // Mock the Address constructor
      Address.mockImplementation(() => ({
        ...mockSavedAddress,
        save: mockSave
      }));

      const response = await request(app)
        .post('/addresses')
        .set('user-id', userId)
        .send(addressData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Address added successfully');
      expect(response.body.address).toBeDefined();
      expect(mockSave).toHaveBeenCalled();
    });

    test('should add minimal address data', async () => {
      const addressData = {
        addressLine1: '123 Simple St',
        city: 'Boston',
        state: 'MA',
        pincode: '02101'
      };

      const mockSavedAddress = { ...addressData, _id: '64a7c9e5f123456789abcde3', user: userId };
      const mockSave = jest.fn().mockResolvedValue(mockSavedAddress);
      
      // Mock the Address constructor
      Address.mockImplementation(() => ({
        ...mockSavedAddress,
        save: mockSave
      }));

      const response = await request(app)
        .post('/addresses')
        .set('user-id', userId)
        .send(addressData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Address added successfully');
      expect(mockSave).toHaveBeenCalled();
    });

    test('should handle validation errors', async () => {
      const mockSave = jest.fn().mockRejectedValue({
        name: 'ValidationError',
        errors: {
          addressLine1: { message: 'Address line 1 is required' }
        }
      });
      
      // Mock the Address constructor
      Address.mockImplementation(() => ({
        save: mockSave
      }));

      const response = await request(app)
        .post('/addresses')
        .set('user-id', userId)
        .send({})
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to add address');
    });

    test('should handle database errors', async () => {
      const mockSave = jest.fn().mockRejectedValue(new Error('Database connection lost'));
      
      // Mock the Address constructor
      Address.mockImplementation(() => ({
        save: mockSave
      }));

      const addressData = {
        addressLine1: '123 Test St',
        city: 'Test City',
        state: 'TS',
        pincode: '12345'
      };

      const response = await request(app)
        .post('/addresses')
        .set('user-id', userId)
        .send(addressData)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to add address');
    });
  });

  describe('PUT /addresses/:id', () => {
    test('should update address successfully', async () => {
      const updateData = {
        label: 'Updated Home',
        addressLine2: 'Updated Apt 2',
        contactName: 'Jane Doe'
      };

      const updatedAddress = { ...mockAddress, ...updateData };
      
      jest.spyOn(Address, 'findOneAndUpdate').mockResolvedValue(updatedAddress);

      const response = await request(app)
        .put('/addresses/64a7c9e5f123456789abcde1')
        .set('user-id', userId)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Address updated successfully');
      expect(response.body.address).toBeDefined();
      expect(response.body.address.label).toBe('Updated Home');
      expect(Address.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: '64a7c9e5f123456789abcde1', user: userId },
        updateData,
        { new: true, runValidators: true }
      );
    });

    test('should return 404 for non-existent address', async () => {
      jest.spyOn(Address, 'findOneAndUpdate').mockResolvedValue(null);

      const updateData = { label: 'New Label' };

      const response = await request(app)
        .put('/addresses/64a7c9e5f123456789abcde9')
        .set('user-id', userId)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Address not found');
    });

    test('should return 404 when updating other user address', async () => {
      jest.spyOn(Address, 'findOneAndUpdate').mockResolvedValue(null);

      const updateData = { label: 'Hacked Label' };

      const response = await request(app)
        .put('/addresses/64a7c9e5f123456789abcde1')
        .set('user-id', 'different-user-id')
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Address not found');
      expect(Address.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: '64a7c9e5f123456789abcde1', user: 'different-user-id' },
        updateData,
        { new: true, runValidators: true }
      );
    });

    test('should handle validation errors during update', async () => {
      jest.spyOn(Address, 'findOneAndUpdate').mockRejectedValue({
        name: 'ValidationError',
        errors: {
          pincode: { message: 'Invalid pincode format' }
        }
      });

      const updateData = { pincode: 'invalid' };

      const response = await request(app)
        .put('/addresses/64a7c9e5f123456789abcde1')
        .set('user-id', userId)
        .send(updateData)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to update address');
    });

    test('should handle database errors', async () => {
      jest.spyOn(Address, 'findOneAndUpdate').mockRejectedValue(new Error('Database error'));

      const updateData = { label: 'Test Update' };

      const response = await request(app)
        .put('/addresses/64a7c9e5f123456789abcde1')
        .set('user-id', userId)
        .send(updateData)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to update address');
    });
  });

  describe('DELETE /addresses/:id', () => {
    test('should soft delete address successfully', async () => {
      const deletedAddress = { ...mockAddress, isActive: false };
      
      jest.spyOn(Address, 'findOneAndUpdate').mockResolvedValue(deletedAddress);

      const response = await request(app)
        .delete('/addresses/64a7c9e5f123456789abcde1')
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Address deleted successfully');
      expect(Address.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: '64a7c9e5f123456789abcde1', user: userId },
        { isActive: false },
        { new: true }
      );
    });

    test('should return 404 for non-existent address', async () => {
      jest.spyOn(Address, 'findOneAndUpdate').mockResolvedValue(null);

      const response = await request(app)
        .delete('/addresses/64a7c9e5f123456789abcde9')
        .set('user-id', userId)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Address not found');
    });

    test('should return 404 when deleting other user address', async () => {
      jest.spyOn(Address, 'findOneAndUpdate').mockResolvedValue(null);

      const response = await request(app)
        .delete('/addresses/64a7c9e5f123456789abcde1')
        .set('user-id', 'different-user-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Address not found');
    });

    test('should handle database errors', async () => {
      jest.spyOn(Address, 'findOneAndUpdate').mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete('/addresses/64a7c9e5f123456789abcde1')
        .set('user-id', userId)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to delete address');
    });
  });

  describe('PUT /addresses/:id/default', () => {
    test('should set default address successfully', async () => {
      const defaultAddress = { ...mockAddress, isDefault: true };
      
      const mockAddress_findOne = {
        setAsDefault: jest.fn().mockResolvedValue()
      };
      
      jest.spyOn(Address, 'findOne').mockResolvedValue(mockAddress_findOne);

      const response = await request(app)
        .put('/addresses/64a7c9e5f123456789abcde1/default')
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Default address updated successfully');
      expect(Address.findOne).toHaveBeenCalledWith({
        _id: '64a7c9e5f123456789abcde1',
        user: userId
      });
      expect(mockAddress_findOne.setAsDefault).toHaveBeenCalled();
    });

    test('should return 404 for non-existent address', async () => {
      jest.spyOn(Address, 'findOne').mockResolvedValue(null);

      const response = await request(app)
        .put('/addresses/64a7c9e5f123456789abcde9/default')
        .set('user-id', userId)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Address not found');
    });

    test('should return 404 when setting default for other user address', async () => {
      jest.spyOn(Address, 'findOne').mockResolvedValue(null);

      const response = await request(app)
        .put('/addresses/64a7c9e5f123456789abcde1/default')
        .set('user-id', 'different-user-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Address not found');
      expect(Address.findOne).toHaveBeenCalledWith({
        _id: '64a7c9e5f123456789abcde1',
        user: 'different-user-id'
      });
    });

    test('should handle errors in setAsDefault method', async () => {
      const mockAddress_findOne = {
        setAsDefault: jest.fn().mockRejectedValue(new Error('Database error in setAsDefault'))
      };
      
      jest.spyOn(Address, 'findOne').mockResolvedValue(mockAddress_findOne);

      const response = await request(app)
        .put('/addresses/64a7c9e5f123456789abcde1/default')
        .set('user-id', userId)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to set default address');
    });

    test('should handle database errors', async () => {
      jest.spyOn(Address, 'findOne').mockRejectedValue(new Error('Database connection error'));

      const response = await request(app)
        .put('/addresses/64a7c9e5f123456789abcde1/default')
        .set('user-id', userId)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to set default address');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});