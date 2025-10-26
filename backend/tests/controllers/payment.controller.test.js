const request = require('supertest');
const express = require('express');
const Order = require('../../src/models/Order');
const { createPaymentIntent, confirmPayment } = require('../../src/controllers/payment.controller');

// Mock stripe
const mockStripe = {
  paymentIntents: {
    create: jest.fn(),
    retrieve: jest.fn()
  }
};

jest.mock('stripe', () => jest.fn(() => mockStripe));

// Create express app for testing
const app = express();
app.use(express.json());

// Mock auth middleware
const mockAuth = (req, res, next) => {
  req.user = { id: req.headers['user-id'] || '64a7c9e5f123456789abcdef' };
  next();
};

// Routes for testing
app.post('/payment/intent', mockAuth, createPaymentIntent);
app.post('/payment/confirm', mockAuth, confirmPayment);

describe('Payment Controller', () => {
  let userId;
  let mockOrder;

  beforeEach(() => {
    userId = '64a7c9e5f123456789abcdef';
    
    mockOrder = {
      _id: '64a7c9e5f123456789abcde1',
      user: userId,
      orderNumber: 'ORD-001',
      status: 'confirmed',
      payment: {
        method: 'CARD',
        status: 'Pending'
      },
      pricing: {
        total: 120
      }
    };

    // Set up test environment
    process.env.NODE_ENV = 'test';
    process.env.MOCK_PAYMENT = 'true';
  });

  describe('POST /payment/intent', () => {
    test('should create payment intent successfully', async () => {
      jest.spyOn(Order, 'findById').mockResolvedValue(mockOrder);
      
      const mockPaymentIntent = {
        id: 'pi_test_123',
        client_secret: 'pi_test_123_secret',
        amount: 12000,
        currency: 'inr'
      };
      
      mockStripe.paymentIntents.create.mockResolvedValue(mockPaymentIntent);

      const response = await request(app)
        .post('/payment/intent')
        .set('user-id', userId)
        .send({
          orderId: mockOrder._id,
          amount: 120
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.clientSecret).toBe('pi_test_123_secret');
      expect(Order.findById).toHaveBeenCalledWith(mockOrder._id);
      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: 12000, // 120 * 100 cents
        currency: 'inr',
        metadata: {
          orderId: mockOrder._id,
          userId: userId
        }
      });
    });

    test('should handle decimal amounts correctly', async () => {
      jest.spyOn(Order, 'findById').mockResolvedValue(mockOrder);
      
      const mockPaymentIntent = {
        id: 'pi_test_456',
        client_secret: 'pi_test_456_secret',
        amount: 12567,
        currency: 'inr'
      };
      
      mockStripe.paymentIntents.create.mockResolvedValue(mockPaymentIntent);

      const response = await request(app)
        .post('/payment/intent')
        .set('user-id', userId)
        .send({
          orderId: mockOrder._id,
          amount: 125.67
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: 12567, // Rounded to cents
        currency: 'inr',
        metadata: {
          orderId: mockOrder._id,
          userId: userId
        }
      });
    });

    test('should return 404 for non-existent order', async () => {
      jest.spyOn(Order, 'findById').mockResolvedValue(null);

      const response = await request(app)
        .post('/payment/intent')
        .set('user-id', userId)
        .send({
          orderId: 'invalid-order-id',
          amount: 100
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Order not found');
    });

    test('should return 404 for unauthorized order access', async () => {
      const unauthorizedOrder = { ...mockOrder, user: 'different-user-id' };
      jest.spyOn(Order, 'findById').mockResolvedValue(unauthorizedOrder);

      const response = await request(app)
        .post('/payment/intent')
        .set('user-id', userId)
        .send({
          orderId: mockOrder._id,
          amount: 100
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Order not found');
    });

    test('should handle stripe errors', async () => {
      jest.spyOn(Order, 'findById').mockResolvedValue(mockOrder);
      mockStripe.paymentIntents.create.mockRejectedValue(new Error('Stripe API error'));

      const response = await request(app)
        .post('/payment/intent')
        .set('user-id', userId)
        .send({
          orderId: mockOrder._id,
          amount: 100
        })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to create payment intent');
    });

    test('should handle database errors', async () => {
      jest.spyOn(Order, 'findById').mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/payment/intent')
        .set('user-id', userId)
        .send({
          orderId: mockOrder._id,
          amount: 100
        })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to create payment intent');
    });
  });

  describe('POST /payment/confirm', () => {
    test('should confirm successful payment', async () => {
      const mockPaymentIntent = {
        id: 'pi_test_123',
        status: 'succeeded',
        amount: 12000 // 120.00 in cents
      };
      
      const updatedOrder = {
        ...mockOrder,
        payment: {
          method: 'CARD',
          status: 'Completed',
          transactionId: 'pi_test_123',
          paidAt: new Date()
        },
        pricing: {
          ...mockOrder.pricing,
          paidAmount: 120
        }
      };
      
      mockStripe.paymentIntents.retrieve.mockResolvedValue(mockPaymentIntent);
      jest.spyOn(Order, 'findByIdAndUpdate').mockResolvedValue(updatedOrder);

      const response = await request(app)
        .post('/payment/confirm')
        .set('user-id', userId)
        .send({
          orderId: mockOrder._id,
          paymentIntentId: 'pi_test_123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Payment confirmed successfully');
      expect(response.body.order).toBeDefined();
      expect(response.body.order.payment.status).toBe('Completed');
      
      expect(mockStripe.paymentIntents.retrieve).toHaveBeenCalledWith('pi_test_123');
      expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
        mockOrder._id,
        {
          'payment.status': 'Completed',
          'payment.transactionId': 'pi_test_123',
          'payment.paidAt': expect.any(Date),
          'pricing.paidAmount': 120
        },
        { new: true }
      );
    });

    test('should reject unsuccessful payment', async () => {
      const mockPaymentIntent = {
        id: 'pi_test_456',
        status: 'requires_payment_method', // Not succeeded
        amount: 12000
      };
      
      mockStripe.paymentIntents.retrieve.mockResolvedValue(mockPaymentIntent);

      const response = await request(app)
        .post('/payment/confirm')
        .set('user-id', userId)
        .send({
          orderId: mockOrder._id,
          paymentIntentId: 'pi_test_456'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Payment not successful');
    });

    test('should handle different payment statuses', async () => {
      const testStatuses = [
        'requires_payment_method',
        'requires_confirmation',
        'requires_action',
        'processing',
        'requires_capture',
        'canceled'
      ];

      for (const status of testStatuses) {
        const mockPaymentIntent = {
          id: `pi_test_${status}`,
          status: status,
          amount: 12000
        };
        
        mockStripe.paymentIntents.retrieve.mockResolvedValue(mockPaymentIntent);

        const response = await request(app)
          .post('/payment/confirm')
          .set('user-id', userId)
          .send({
            orderId: mockOrder._id,
            paymentIntentId: `pi_test_${status}`
          })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Payment not successful');
      }
    });

    test('should handle stripe retrieve errors', async () => {
      mockStripe.paymentIntents.retrieve.mockRejectedValue(
        new Error('Payment intent not found')
      );

      const response = await request(app)
        .post('/payment/confirm')
        .set('user-id', userId)
        .send({
          orderId: mockOrder._id,
          paymentIntentId: 'invalid_pi_123'
        })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to confirm payment');
    });

    test('should handle order update errors', async () => {
      const mockPaymentIntent = {
        id: 'pi_test_789',
        status: 'succeeded',
        amount: 12000
      };
      
      mockStripe.paymentIntents.retrieve.mockResolvedValue(mockPaymentIntent);
      jest.spyOn(Order, 'findByIdAndUpdate').mockRejectedValue(
        new Error('Database update failed')
      );

      const response = await request(app)
        .post('/payment/confirm')
        .set('user-id', userId)
        .send({
          orderId: mockOrder._id,
          paymentIntentId: 'pi_test_789'
        })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to confirm payment');
    });

    test('should handle missing required fields', async () => {
      const response = await request(app)
        .post('/payment/confirm')
        .set('user-id', userId)
        .send({
          // Missing orderId and paymentIntentId
        })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to confirm payment');
    });

    test('should calculate paid amount correctly from cents', async () => {
      const mockPaymentIntent = {
        id: 'pi_test_decimal',
        status: 'succeeded',
        amount: 12567 // 125.67 in cents
      };
      
      const updatedOrder = {
        ...mockOrder,
        payment: {
          method: 'CARD',
          status: 'Completed',
          transactionId: 'pi_test_decimal'
        },
        pricing: {
          ...mockOrder.pricing,
          paidAmount: 125.67
        }
      };
      
      mockStripe.paymentIntents.retrieve.mockResolvedValue(mockPaymentIntent);
      jest.spyOn(Order, 'findByIdAndUpdate').mockResolvedValue(updatedOrder);

      const response = await request(app)
        .post('/payment/confirm')
        .set('user-id', userId)
        .send({
          orderId: mockOrder._id,
          paymentIntentId: 'pi_test_decimal'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
        mockOrder._id,
        expect.objectContaining({
          'pricing.paidAmount': 125.67
        }),
        { new: true }
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Clean up environment variables
    delete process.env.MOCK_PAYMENT;
  });
});