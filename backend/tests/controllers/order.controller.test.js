const request = require('supertest');
const express = require('express');
const Order = require('../../src/models/Order');
const Cart = require('../../src/models/Cart');
const Medicine = require('../../src/models/Medicine');
const Address = require('../../src/models/Address');
const { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  cancelOrder, 
  trackOrder 
} = require('../../src/controllers/order.controller');

// Create express app for testing
const app = express();
app.use(express.json());

// Mock auth middleware
const mockAuth = (req, res, next) => {
  req.user = { id: req.headers['user-id'] || '64a7c9e5f123456789abcdef' };
  next();
};

// Routes for testing
app.post('/orders', mockAuth, createOrder);
app.get('/orders', mockAuth, getUserOrders);
app.get('/orders/:id', mockAuth, getOrderById);
app.put('/orders/:id/cancel', mockAuth, cancelOrder);
app.get('/orders/:id/track', mockAuth, trackOrder);

describe('Order Controller', () => {
  let userId;
  let mockCart, mockAddress, mockMedicine;

  beforeEach(() => {
    userId = '64a7c9e5f123456789abcdef';
    
    mockMedicine = {
      _id: '64a7c9e5f123456789abcde1',
      name: 'Paracetamol 500mg',
      brand: 'Generic',
      images: [{ url: 'medicine1.jpg' }],
      sku: 'MED001'
    };

    mockCart = {
      user: userId,
      items: [
        {
          medicine: mockMedicine,
          quantity: 2,
          price: 50,
          mrp: 60
        }
      ],
      pricing: {
        subtotal: 100,
        deliveryFee: 20,
        total: 120
      },
      requiresPrescription: false,
      clearCart: jest.fn(),
      populate: jest.fn().mockResolvedValue()
    };

    mockAddress = {
      _id: '64a7c9e5f123456789abcde2',
      label: 'Home',
      addressLine1: '123 Main St',
      addressLine2: 'Apt 1',
      city: 'New York',
      state: 'NY',
      pincode: '10001',
      location: {
        coordinates: [-73.935242, 40.730610]
      }
    };
  });

  describe('POST /orders', () => {
    test('should create order successfully with COD payment', async () => {
      // Mock cart with populated medicine
      const mockPopulate = jest.fn().mockResolvedValue(mockCart);
      jest.spyOn(Cart, 'findOne').mockReturnValue({ populate: mockPopulate });
      
      jest.spyOn(Address, 'findById').mockResolvedValue(mockAddress);
      
      const mockOrder = {
        _id: '64a7c9e5f123456789abcde3',
        user: userId,
        save: jest.fn(),
        populate: jest.fn().mockResolvedValue()
      };
      
      jest.spyOn(Order.prototype, 'constructor').mockImplementation(() => mockOrder);
      Order.prototype.save = mockOrder.save;
      Order.prototype.populate = mockOrder.populate;
      
      jest.spyOn(Medicine, 'findByIdAndUpdate').mockResolvedValue();

      const orderData = {
        deliveryAddressId: mockAddress._id,
        paymentMethod: 'COD',
        notes: 'Please deliver after 6pm'
      };

      const response = await request(app)
        .post('/orders')
        .set('user-id', userId)
        .send(orderData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Order placed successfully');
      expect(response.body.order).toBeDefined();
      expect(mockOrder.save).toHaveBeenCalled();
      expect(mockCart.clearCart).toHaveBeenCalled();
      expect(Medicine.findByIdAndUpdate).toHaveBeenCalledWith(
        mockMedicine._id,
        { $inc: { stock: -2, salesCount: 2 } }
      );
    });

    test('should create order successfully with online payment', async () => {
      const mockPopulate = jest.fn().mockResolvedValue(mockCart);
      jest.spyOn(Cart, 'findOne').mockReturnValue({ populate: mockPopulate });
      jest.spyOn(Address, 'findById').mockResolvedValue(mockAddress);
      
      const mockOrder = {
        _id: '64a7c9e5f123456789abcde3',
        save: jest.fn(),
        populate: jest.fn().mockResolvedValue()
      };
      
      jest.spyOn(Order.prototype, 'constructor').mockImplementation(() => mockOrder);
      Order.prototype.save = mockOrder.save;
      Order.prototype.populate = mockOrder.populate;
      
      jest.spyOn(Medicine, 'findByIdAndUpdate').mockResolvedValue();

      const orderData = {
        deliveryAddressId: mockAddress._id,
        paymentMethod: 'CARD',
        prescriptionIds: ['64a7c9e5f123456789abcde4']
      };

      const response = await request(app)
        .post('/orders')
        .set('user-id', userId)
        .send(orderData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Order placed successfully');
    });

    test('should return 400 for empty cart', async () => {
      const emptyCart = { ...mockCart, items: [] };
      const mockPopulate = jest.fn().mockResolvedValue(emptyCart);
      jest.spyOn(Cart, 'findOne').mockReturnValue({ populate: mockPopulate });

      const orderData = {
        deliveryAddressId: mockAddress._id,
        paymentMethod: 'COD'
      };

      const response = await request(app)
        .post('/orders')
        .set('user-id', userId)
        .send(orderData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Cart is empty');
    });

    test('should return 400 when cart not found', async () => {
      const mockPopulate = jest.fn().mockResolvedValue(null);
      jest.spyOn(Cart, 'findOne').mockReturnValue({ populate: mockPopulate });

      const orderData = {
        deliveryAddressId: mockAddress._id,
        paymentMethod: 'COD'
      };

      const response = await request(app)
        .post('/orders')
        .set('user-id', userId)
        .send(orderData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Cart is empty');
    });

    test('should return 404 for invalid delivery address', async () => {
      const mockPopulate = jest.fn().mockResolvedValue(mockCart);
      jest.spyOn(Cart, 'findOne').mockReturnValue({ populate: mockPopulate });
      jest.spyOn(Address, 'findById').mockResolvedValue(null);

      const orderData = {
        deliveryAddressId: 'invalid-address-id',
        paymentMethod: 'COD'
      };

      const response = await request(app)
        .post('/orders')
        .set('user-id', userId)
        .send(orderData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Delivery address not found');
    });

    test('should handle database errors', async () => {
      jest.spyOn(Cart, 'findOne').mockRejectedValue(new Error('Database error'));

      const orderData = {
        deliveryAddressId: mockAddress._id,
        paymentMethod: 'COD'
      };

      const response = await request(app)
        .post('/orders')
        .set('user-id', userId)
        .send(orderData)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to create order');
    });
  });

  describe('GET /orders', () => {
    test('should get user orders with pagination', async () => {
      const mockOrders = [
        {
          _id: '64a7c9e5f123456789abcde3',
          user: userId,
          status: 'pending',
          createdAt: new Date()
        },
        {
          _id: '64a7c9e5f123456789abcde4',
          user: userId,
          status: 'delivered',
          createdAt: new Date(Date.now() - 86400000) // 1 day ago
        }
      ];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockOrders)
      };

      jest.spyOn(Order, 'find').mockReturnValue(mockQuery);
      jest.spyOn(Order, 'countDocuments').mockResolvedValue(2);

      const response = await request(app)
        .get('/orders?page=1&limit=10')
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.totalOrders).toBe(2);
      expect(response.body.currentPage).toBe(1);
      expect(response.body.totalPages).toBe(1);
      expect(response.body.orders).toHaveLength(2);
      expect(Order.find).toHaveBeenCalledWith({ user: userId });
    });

    test('should filter orders by status', async () => {
      const mockOrders = [
        {
          _id: '64a7c9e5f123456789abcde3',
          user: userId,
          status: 'pending',
          createdAt: new Date()
        }
      ];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockOrders)
      };

      jest.spyOn(Order, 'find').mockReturnValue(mockQuery);
      jest.spyOn(Order, 'countDocuments').mockResolvedValue(1);

      const response = await request(app)
        .get('/orders?status=pending')
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.orders).toHaveLength(1);
      expect(Order.find).toHaveBeenCalledWith({ user: userId, status: 'pending' });
    });

    test('should handle database errors', async () => {
      jest.spyOn(Order, 'find').mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/orders')
        .set('user-id', userId)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to get orders');
    });
  });

  describe('GET /orders/:id', () => {
    test('should get order by ID successfully', async () => {
      const mockOrder = {
        _id: '64a7c9e5f123456789abcde3',
        user: userId,
        status: 'pending',
        populate: jest.fn().mockResolvedValue()
      };

      const mockQuery = {
        populate: jest.fn().mockResolvedValue(mockOrder)
      };

      jest.spyOn(Order, 'findById').mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/orders/64a7c9e5f123456789abcde3')
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.order).toBeDefined();
      expect(Order.findById).toHaveBeenCalledWith('64a7c9e5f123456789abcde3');
    });

    test('should return 404 for non-existent order', async () => {
      const mockQuery = {
        populate: jest.fn().mockResolvedValue(null)
      };

      jest.spyOn(Order, 'findById').mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/orders/64a7c9e5f123456789abcde3')
        .set('user-id', userId)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Order not found');
    });

    test('should return 403 for unauthorized access', async () => {
      const mockOrder = {
        _id: '64a7c9e5f123456789abcde3',
        user: 'different-user-id',
        status: 'pending'
      };

      const mockQuery = {
        populate: jest.fn().mockResolvedValue(mockOrder)
      };

      jest.spyOn(Order, 'findById').mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/orders/64a7c9e5f123456789abcde3')
        .set('user-id', userId)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access denied');
    });
  });

  describe('PUT /orders/:id/cancel', () => {
    test('should cancel order successfully', async () => {
      const mockOrder = {
        _id: '64a7c9e5f123456789abcde3',
        user: userId,
        status: 'pending',
        canBeCancelled: true,
        items: [
          {
            medicine: mockMedicine._id,
            quantity: 2
          }
        ],
        cancelOrder: jest.fn()
      };

      jest.spyOn(Order, 'findById').mockResolvedValue(mockOrder);
      jest.spyOn(Medicine, 'findByIdAndUpdate').mockResolvedValue();

      const response = await request(app)
        .put('/orders/64a7c9e5f123456789abcde3/cancel')
        .set('user-id', userId)
        .send({ reason: 'Changed my mind' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Order cancelled successfully');
      expect(mockOrder.cancelOrder).toHaveBeenCalledWith('Changed my mind', 'customer');
      expect(Medicine.findByIdAndUpdate).toHaveBeenCalledWith(
        mockMedicine._id,
        { $inc: { stock: 2, salesCount: -2 } }
      );
    });

    test('should return 404 for non-existent order', async () => {
      jest.spyOn(Order, 'findById').mockResolvedValue(null);

      const response = await request(app)
        .put('/orders/64a7c9e5f123456789abcde3/cancel')
        .set('user-id', userId)
        .send({ reason: 'Changed my mind' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Order not found');
    });

    test('should return 403 for unauthorized cancellation', async () => {
      const mockOrder = {
        _id: '64a7c9e5f123456789abcde3',
        user: 'different-user-id',
        status: 'pending'
      };

      jest.spyOn(Order, 'findById').mockResolvedValue(mockOrder);

      const response = await request(app)
        .put('/orders/64a7c9e5f123456789abcde3/cancel')
        .set('user-id', userId)
        .send({ reason: 'Changed my mind' })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access denied');
    });

    test('should return 400 if order cannot be cancelled', async () => {
      const mockOrder = {
        _id: '64a7c9e5f123456789abcde3',
        user: userId,
        status: 'delivered',
        canBeCancelled: false
      };

      jest.spyOn(Order, 'findById').mockResolvedValue(mockOrder);

      const response = await request(app)
        .put('/orders/64a7c9e5f123456789abcde3/cancel')
        .set('user-id', userId)
        .send({ reason: 'Changed my mind' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Order cannot be cancelled at this stage');
    });
  });

  describe('GET /orders/:id/track', () => {
    test('should track order successfully', async () => {
      const mockOrder = {
        _id: '64a7c9e5f123456789abcde3',
        user: {
          _id: userId,
          name: 'John Doe',
          phoneNumber: '+1234567890'
        },
        orderNumber: 'ORD-001',
        status: 'shipped',
        statusHistory: [
          { status: 'pending', timestamp: new Date() },
          { status: 'confirmed', timestamp: new Date() },
          { status: 'shipped', timestamp: new Date() }
        ],
        delivery: {
          estimatedDeliveryTime: new Date(Date.now() + 86400000) // tomorrow
        }
      };

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(mockOrder)
      };

      jest.spyOn(Order, 'findById').mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/orders/64a7c9e5f123456789abcde3/track')
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.tracking).toBeDefined();
      expect(response.body.tracking.orderNumber).toBe('ORD-001');
      expect(response.body.tracking.status).toBe('shipped');
      expect(response.body.tracking.statusHistory).toHaveLength(3);
      expect(response.body.tracking.estimatedDelivery).toBeDefined();
    });

    test('should return 404 for non-existent order', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(null)
      };

      jest.spyOn(Order, 'findById').mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/orders/64a7c9e5f123456789abcde3/track')
        .set('user-id', userId)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Order not found');
    });

    test('should return 403 for unauthorized tracking', async () => {
      const mockOrder = {
        _id: '64a7c9e5f123456789abcde3',
        user: {
          _id: 'different-user-id',
          name: 'Jane Doe',
          phoneNumber: '+9876543210'
        }
      };

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(mockOrder)
      };

      jest.spyOn(Order, 'findById').mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/orders/64a7c9e5f123456789abcde3/track')
        .set('user-id', userId)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access denied');
    });

    test('should handle database errors', async () => {
      jest.spyOn(Order, 'findById').mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/orders/64a7c9e5f123456789abcde3/track')
        .set('user-id', userId)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to track order');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});