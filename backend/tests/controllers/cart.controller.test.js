const request = require('supertest');
const express = require('express');
const Cart = require('../../src/models/Cart');
const Medicine = require('../../src/models/Medicine');
const { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart, 
  applyCoupon 
} = require('../../src/controllers/cart.controller');

// Mock express-validator
jest.mock('express-validator', () => ({
  validationResult: jest.fn(() => ({
    isEmpty: () => true,
    array: () => []
  }))
}));

const { validationResult } = require('express-validator');

// Create express app for testing
const app = express();
app.use(express.json());

// Mock auth middleware
const mockAuth = (req, res, next) => {
  req.user = { id: req.headers['user-id'] || '64a7c9e5f123456789abcdef' };
  next();
};

// Routes for testing
app.get('/cart', mockAuth, getCart);
app.post('/cart', mockAuth, addToCart);
app.put('/cart/:itemId', mockAuth, updateCartItem);
app.delete('/cart/:itemId', mockAuth, removeFromCart);
app.delete('/cart', mockAuth, clearCart);
app.post('/cart/coupon', mockAuth, applyCoupon);

describe('Cart Controller', () => {
  let userId;
  let medicine1, medicine2;
  let cart;

  beforeEach(() => {
    userId = '64a7c9e5f123456789abcdef';
    
    // Mock medicine data
    medicine1 = {
      _id: '64a7c9e5f123456789abcde1',
      name: 'Paracetamol 500mg',
      brand: 'Generic',
      images: [{ url: 'medicine1.jpg' }],
      sellingPrice: 50,
      mrp: 60,
      stock: 100,
      requiresPrescription: false,
      status: 'active',
      sku: 'MED001'
    };

    medicine2 = {
      _id: '64a7c9e5f123456789abcde2',
      name: 'Ibuprofen 400mg',
      brand: 'Brand',
      images: [{ url: 'medicine2.jpg' }],
      sellingPrice: 80,
      mrp: 100,
      stock: 50,
      requiresPrescription: false,
      status: 'active',
      sku: 'MED002'
    };
  });

  describe('GET /cart', () => {
    test('should create and return empty cart for new user', async () => {
      jest.spyOn(Cart, 'findOne').mockResolvedValue(null);
      const mockSave = jest.fn();
      const mockCart = {
        user: userId,
        items: [],
        save: mockSave
      };
      jest.spyOn(Cart.prototype, 'constructor').mockImplementation(() => mockCart);
      Cart.prototype.save = mockSave;

      const response = await request(app)
        .get('/cart')
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cart).toBeDefined();
      expect(mockSave).toHaveBeenCalled();
    });

    test('should return existing cart with filtered items', async () => {
      const mockCart = {
        user: userId,
        items: [
          {
            _id: '64a7c9e5f123456789abcd01',
            medicine: { ...medicine1 },
            quantity: 2,
            price: 50
          },
          {
            _id: '64a7c9e5f123456789abcd02',
            medicine: { ...medicine2, status: 'inactive' }, // Inactive medicine
            quantity: 1,
            price: 80
          }
        ],
        save: jest.fn()
      };

      const mockPopulate = jest.fn().mockResolvedValue(mockCart);
      jest.spyOn(Cart, 'findOne').mockReturnValue({ populate: mockPopulate });

      const response = await request(app)
        .get('/cart')
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cart).toBeDefined();
      expect(mockPopulate).toHaveBeenCalled();
    });

    test('should handle database errors', async () => {
      jest.spyOn(Cart, 'findOne').mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/cart')
        .set('user-id', userId)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to get cart');
    });
  });

  describe('POST /cart', () => {
    test('should add medicine to cart successfully', async () => {
      jest.spyOn(Medicine, 'findById').mockResolvedValue(medicine1);
      
      const mockCart = {
        user: userId,
        items: [],
        addItem: jest.fn(),
        populate: jest.fn().mockResolvedValue()
      };
      
      jest.spyOn(Cart, 'findOne').mockResolvedValue(mockCart);

      const response = await request(app)
        .post('/cart')
        .set('user-id', userId)
        .send({ medicineId: medicine1._id, quantity: 2 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Item added to cart successfully');
      expect(mockCart.addItem).toHaveBeenCalledWith(medicine1._id, 2, medicine1);
    });

    test('should create new cart if user has no cart', async () => {
      jest.spyOn(Medicine, 'findById').mockResolvedValue(medicine1);
      jest.spyOn(Cart, 'findOne').mockResolvedValue(null);
      
      const mockCart = {
        user: userId,
        addItem: jest.fn(),
        populate: jest.fn().mockResolvedValue()
      };
      
      jest.spyOn(Cart.prototype, 'constructor').mockImplementation(() => mockCart);

      const response = await request(app)
        .post('/cart')
        .set('user-id', userId)
        .send({ medicineId: medicine1._id, quantity: 1 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockCart.addItem).toHaveBeenCalled();
    });

    test('should return 404 for non-existent medicine', async () => {
      jest.spyOn(Medicine, 'findById').mockResolvedValue(null);

      const response = await request(app)
        .post('/cart')
        .set('user-id', userId)
        .send({ medicineId: 'invalid-id', quantity: 1 })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Medicine not found');
    });

    test('should return 400 for inactive medicine', async () => {
      const inactiveMedicine = { ...medicine1, status: 'inactive' };
      jest.spyOn(Medicine, 'findById').mockResolvedValue(inactiveMedicine);

      const response = await request(app)
        .post('/cart')
        .set('user-id', userId)
        .send({ medicineId: medicine1._id, quantity: 1 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Medicine is not available');
    });

    test('should return 400 for insufficient stock', async () => {
      const lowStockMedicine = { ...medicine1, stock: 1 };
      jest.spyOn(Medicine, 'findById').mockResolvedValue(lowStockMedicine);

      const response = await request(app)
        .post('/cart')
        .set('user-id', userId)
        .send({ medicineId: medicine1._id, quantity: 5 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Insufficient stock available');
    });

    test('should handle validation errors', async () => {
      validationResult.mockReturnValueOnce({
        isEmpty: () => false,
        array: () => [{ msg: 'Medicine ID is required' }]
      });

      const response = await request(app)
        .post('/cart')
        .set('user-id', userId)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toHaveLength(1);
    });
  });

  describe('PUT /cart/:itemId', () => {
    test('should update cart item quantity successfully', async () => {
      const mockCart = {
        user: userId,
        items: [],
        updateItem: jest.fn(),
        populate: jest.fn().mockResolvedValue()
      };
      
      jest.spyOn(Cart, 'findOne').mockResolvedValue(mockCart);

      const response = await request(app)
        .put('/cart/64a7c9e5f123456789abcd01')
        .set('user-id', userId)
        .send({ quantity: 3 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Cart updated successfully');
      expect(mockCart.updateItem).toHaveBeenCalledWith('64a7c9e5f123456789abcd01', 3);
    });

    test('should return 400 for negative quantity', async () => {
      const response = await request(app)
        .put('/cart/64a7c9e5f123456789abcd01')
        .set('user-id', userId)
        .send({ quantity: -1 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Quantity cannot be negative');
    });

    test('should return 404 if cart not found', async () => {
      jest.spyOn(Cart, 'findOne').mockResolvedValue(null);

      const response = await request(app)
        .put('/cart/64a7c9e5f123456789abcd01')
        .set('user-id', userId)
        .send({ quantity: 2 })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Cart not found');
    });

    test('should handle database errors', async () => {
      jest.spyOn(Cart, 'findOne').mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/cart/64a7c9e5f123456789abcd01')
        .set('user-id', userId)
        .send({ quantity: 2 })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to update cart');
    });
  });

  describe('DELETE /cart/:itemId', () => {
    test('should remove item from cart successfully', async () => {
      const mockCart = {
        user: userId,
        items: [],
        removeItem: jest.fn(),
        populate: jest.fn().mockResolvedValue()
      };
      
      jest.spyOn(Cart, 'findOne').mockResolvedValue(mockCart);

      const response = await request(app)
        .delete('/cart/64a7c9e5f123456789abcd01')
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Item removed from cart successfully');
      expect(mockCart.removeItem).toHaveBeenCalledWith('64a7c9e5f123456789abcd01');
    });

    test('should return 404 if cart not found', async () => {
      jest.spyOn(Cart, 'findOne').mockResolvedValue(null);

      const response = await request(app)
        .delete('/cart/64a7c9e5f123456789abcd01')
        .set('user-id', userId)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Cart not found');
    });
  });

  describe('DELETE /cart', () => {
    test('should clear cart successfully', async () => {
      const mockCart = {
        user: userId,
        items: [{ _id: '1', medicine: medicine1, quantity: 2 }],
        clearCart: jest.fn()
      };
      
      jest.spyOn(Cart, 'findOne').mockResolvedValue(mockCart);

      const response = await request(app)
        .delete('/cart')
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Cart cleared successfully');
      expect(mockCart.clearCart).toHaveBeenCalled();
    });

    test('should return 404 if cart not found', async () => {
      jest.spyOn(Cart, 'findOne').mockResolvedValue(null);

      const response = await request(app)
        .delete('/cart')
        .set('user-id', userId)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Cart not found');
    });
  });

  describe('POST /cart/coupon', () => {
    test('should apply valid coupon successfully', async () => {
      const mockCart = {
        user: userId,
        items: [{ _id: '1', medicine: medicine1, quantity: 2 }],
        applyCoupon: jest.fn()
      };
      
      jest.spyOn(Cart, 'findOne').mockResolvedValue(mockCart);

      const response = await request(app)
        .post('/cart/coupon')
        .set('user-id', userId)
        .send({ couponCode: 'SAVE10' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Coupon applied successfully');
      expect(mockCart.applyCoupon).toHaveBeenCalledWith('SAVE10', 10, 'percentage');
    });

    test('should apply fixed discount coupon successfully', async () => {
      const mockCart = {
        user: userId,
        items: [{ _id: '1', medicine: medicine1, quantity: 2 }],
        applyCoupon: jest.fn()
      };
      
      jest.spyOn(Cart, 'findOne').mockResolvedValue(mockCart);

      const response = await request(app)
        .post('/cart/coupon')
        .set('user-id', userId)
        .send({ couponCode: 'FLAT50' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Coupon applied successfully');
      expect(mockCart.applyCoupon).toHaveBeenCalledWith('FLAT50', 50, 'fixed');
    });

    test('should return 400 for invalid coupon', async () => {
      const mockCart = {
        user: userId,
        items: [{ _id: '1', medicine: medicine1, quantity: 2 }]
      };
      
      jest.spyOn(Cart, 'findOne').mockResolvedValue(mockCart);

      const response = await request(app)
        .post('/cart/coupon')
        .set('user-id', userId)
        .send({ couponCode: 'INVALID' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid coupon code');
    });

    test('should return 404 if cart not found', async () => {
      jest.spyOn(Cart, 'findOne').mockResolvedValue(null);

      const response = await request(app)
        .post('/cart/coupon')
        .set('user-id', userId)
        .send({ couponCode: 'SAVE10' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Cart not found');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Reset validation mock
    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => []
    });
  });
});