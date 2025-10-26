const Cart = require('../../src/models/Cart');
const User = require('../../src/models/User');
const Medicine = require('../../src/models/Medicine');

describe('Cart Model', () => {
  let testUser;
  let testMedicine1;
  let testMedicine2;

  beforeEach(async () => {
    // Create test user
    testUser = await new User({
      phoneNumber: '+1234567890',
      name: 'Test User'
    }).save();

    // Create test medicines
    testMedicine1 = await new Medicine({
      name: 'Paracetamol',
      brand: 'Crocin',
      manufacturer: 'GSK',
      category: 'OTC',
      dosageForm: 'Tablet',
      strength: '500mg',
      packSize: '10 tablets',
      mrp: 50,
      sellingPrice: 45,
      sku: 'MED001',
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      discount: 10
    }).save();

    testMedicine2 = await new Medicine({
      name: 'Aspirin',
      brand: 'Disprin',
      manufacturer: 'Reckitt',
      category: 'Prescription',
      dosageForm: 'Tablet',
      strength: '325mg',
      packSize: '20 tablets',
      mrp: 100,
      sellingPrice: 90,
      sku: 'MED002',
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      discount: 10,
      requiresPrescription: true
    }).save();
  });

  describe('Cart Schema Validation', () => {
    test('should create empty cart with valid user', async () => {
      const cart = new Cart({ user: testUser._id });
      const savedCart = await cart.save();

      expect(savedCart.user.toString()).toBe(testUser._id.toString());
      expect(savedCart.items).toHaveLength(0);
      expect(savedCart.status).toBe('active');
      expect(savedCart.estimatedDeliveryTime).toBe(30);
      expect(savedCart.requiresPrescription).toBe(false);
    });

    test('should require user reference', async () => {
      const cart = new Cart({});
      await expect(cart.save()).rejects.toThrow('User reference is required');
    });

    test('should enforce unique user constraint', async () => {
      await new Cart({ user: testUser._id }).save();
      
      const duplicateCart = new Cart({ user: testUser._id });
      await expect(duplicateCart.save()).rejects.toThrow();
    });

    test('should validate cart item schema', async () => {
      const cart = new Cart({
        user: testUser._id,
        items: [{
          medicine: testMedicine1._id,
          quantity: 2,
          price: 45,
          mrp: 50
        }]
      });

      const savedCart = await cart.save();
      expect(savedCart.items[0].medicine.toString()).toBe(testMedicine1._id.toString());
      expect(savedCart.items[0].quantity).toBe(2);
      expect(savedCart.items[0].discount).toBe(0); // default value
    });

    test('should validate item quantity limits', async () => {
      const cart = new Cart({
        user: testUser._id,
        items: [{
          medicine: testMedicine1._id,
          quantity: 101, // Exceeds max limit
          price: 45,
          mrp: 50
        }]
      });

      await expect(cart.save()).rejects.toThrow('Quantity cannot exceed 100');
    });

    test('should validate minimum quantity', async () => {
      const cart = new Cart({
        user: testUser._id,
        items: [{
          medicine: testMedicine1._id,
          quantity: 0, // Below minimum
          price: 45,
          mrp: 50
        }]
      });

      await expect(cart.save()).rejects.toThrow('Quantity must be at least 1');
    });

    test('should validate negative prices', async () => {
      const cart = new Cart({
        user: testUser._id,
        items: [{
          medicine: testMedicine1._id,
          quantity: 1,
          price: -10, // Negative price
          mrp: 50
        }]
      });

      await expect(cart.save()).rejects.toThrow('Price cannot be negative');
    });

    test('should validate coupon discount type enum', async () => {
      const cart = new Cart({
        user: testUser._id,
        appliedCoupon: {
          code: 'SAVE10',
          discountAmount: 10,
          discountType: 'invalid' // Invalid enum value
        }
      });

      await expect(cart.save()).rejects.toThrow();
    });

    test('should validate status enum', async () => {
      const cart = new Cart({
        user: testUser._id,
        status: 'invalid_status'
      });

      await expect(cart.save()).rejects.toThrow();
    });
  });

  describe('Virtual Properties', () => {
    test('should calculate total items', async () => {
      const cart = new Cart({
        user: testUser._id,
        items: [
          {
            medicine: testMedicine1._id,
            quantity: 2,
            price: 45,
            mrp: 50
          },
          {
            medicine: testMedicine2._id,
            quantity: 3,
            price: 90,
            mrp: 100
          }
        ]
      });

      expect(cart.totalItems).toBe(5); // 2 + 3
    });

    test('should calculate unique items', async () => {
      const cart = new Cart({
        user: testUser._id,
        items: [
          {
            medicine: testMedicine1._id,
            quantity: 2,
            price: 45,
            mrp: 50
          },
          {
            medicine: testMedicine2._id,
            quantity: 3,
            price: 90,
            mrp: 100
          }
        ]
      });

      expect(cart.uniqueItems).toBe(2);
    });

    test('should calculate total savings', async () => {
      const cart = new Cart({
        user: testUser._id,
        pricing: {
          totalMRP: 1000,
          subtotal: 900
        }
      });

      expect(cart.totalSavings).toBe(100);
    });

    test('should detect prescription items', async () => {
      const cartWithoutPrescription = new Cart({
        user: testUser._id,
        items: [{
          medicine: testMedicine1._id,
          quantity: 1,
          price: 45,
          mrp: 50,
          prescription: { isRequired: false }
        }]
      });

      const cartWithPrescription = new Cart({
        user: testUser._id,
        items: [{
          medicine: testMedicine2._id,
          quantity: 1,
          price: 90,
          mrp: 100,
          prescription: { isRequired: true }
        }]
      });

      expect(cartWithoutPrescription.hasPrescriptionItems).toBe(false);
      expect(cartWithPrescription.hasPrescriptionItems).toBe(true);
    });
  });

  describe('Cart Item Management Methods', () => {
    let cart;

    beforeEach(async () => {
      cart = await new Cart({ user: testUser._id }).save();
    });

    test('should add new item to cart', async () => {
      const medicineData = {
        sellingPrice: 45,
        mrp: 50,
        discount: 10,
        requiresPrescription: false
      };

      await cart.addItem(testMedicine1._id, 2, medicineData);

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].medicine.toString()).toBe(testMedicine1._id.toString());
      expect(cart.items[0].quantity).toBe(2);
      expect(cart.items[0].price).toBe(45);
      expect(cart.status).toBe('active');
    });

    test('should update existing item quantity when adding same medicine', async () => {
      const medicineData = {
        sellingPrice: 45,
        mrp: 50,
        discount: 10,
        requiresPrescription: false
      };

      // Add item first time
      await cart.addItem(testMedicine1._id, 2, medicineData);
      
      // Add same item again
      await cart.addItem(testMedicine1._id, 3, medicineData);

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(5); // 2 + 3
    });

    test('should update item quantity', async () => {
      // First add an item
      const medicineData = {
        sellingPrice: 45,
        mrp: 50,
        discount: 10,
        requiresPrescription: false
      };

      await cart.addItem(testMedicine1._id, 2, medicineData);
      const itemId = cart.items[0]._id;

      // Update quantity
      await cart.updateItem(itemId, 5);

      expect(cart.items[0].quantity).toBe(5);
    });

    test('should remove item when updating quantity to 0', async () => {
      // First add an item
      const medicineData = {
        sellingPrice: 45,
        mrp: 50,
        discount: 10,
        requiresPrescription: false
      };

      await cart.addItem(testMedicine1._id, 2, medicineData);
      const itemId = cart.items[0]._id;

      // Update quantity to 0
      await cart.updateItem(itemId, 0);

      expect(cart.items).toHaveLength(0);
    });

    test('should throw error when updating non-existent item', async () => {
      const nonExistentId = new (require('mongoose')).Types.ObjectId();
      
      await expect(cart.updateItem(nonExistentId, 5))
        .rejects
        .toThrow('Item not found in cart');
    });

    test('should remove item from cart', async () => {
      // First add an item
      const medicineData = {
        sellingPrice: 45,
        mrp: 50,
        discount: 10,
        requiresPrescription: false
      };

      await cart.addItem(testMedicine1._id, 2, medicineData);
      const itemId = cart.items[0]._id;

      // Remove item
      await cart.removeItem(itemId);

      expect(cart.items).toHaveLength(0);
    });

    test('should clear all items from cart', async () => {
      // Add multiple items
      const medicineData = {
        sellingPrice: 45,
        mrp: 50,
        discount: 10,
        requiresPrescription: false
      };

      await cart.addItem(testMedicine1._id, 2, medicineData);
      await cart.addItem(testMedicine2._id, 1, {
        sellingPrice: 90,
        mrp: 100,
        discount: 10,
        requiresPrescription: true
      });

      // Apply coupon
      await cart.applyCoupon('SAVE10', 10, 'percentage');

      // Clear cart
      await cart.clearCart();

      expect(cart.items).toHaveLength(0);
      expect(cart.appliedCoupon).toBeUndefined();
      expect(cart.attachedPrescriptions).toHaveLength(0);
    });
  });

  describe('Pricing Calculation', () => {
    let cart;

    beforeEach(async () => {
      cart = await new Cart({ user: testUser._id }).save();
    });

    test('should calculate pricing correctly for items', async () => {
      const medicineData = {
        sellingPrice: 45,
        mrp: 50,
        discount: 10,
        requiresPrescription: false
      };

      await cart.addItem(testMedicine1._id, 2, medicineData);

      expect(cart.pricing.subtotal).toBe(90); // 45 * 2
      expect(cart.pricing.totalMRP).toBe(100); // 50 * 2
      expect(cart.pricing.totalDiscount).toBe(10); // 100 - 90
      expect(cart.pricing.deliveryCharges).toBe(40); // Below threshold
      expect(cart.pricing.platformFee).toBe(2); // 2% of 90
      expect(cart.pricing.gst).toBe(11); // 12% of 90
    });

    test('should calculate free delivery for orders above threshold', async () => {
      // Mock environment variables
      process.env.FREE_DELIVERY_THRESHOLD = 500;
      process.env.DEFAULT_DELIVERY_CHARGE = 40;

      const medicineData = {
        sellingPrice: 300,
        mrp: 350,
        discount: 50,
        requiresPrescription: false
      };

      await cart.addItem(testMedicine1._id, 2, medicineData); // 600 subtotal

      expect(cart.pricing.deliveryCharges).toBe(0);
    });

    test('should apply percentage coupon correctly', async () => {
      const medicineData = {
        sellingPrice: 100,
        mrp: 120,
        discount: 20,
        requiresPrescription: false
      };

      await cart.addItem(testMedicine1._id, 5, medicineData); // 500 subtotal
      await cart.applyCoupon('SAVE10', 10, 'percentage');

      expect(cart.pricing.couponDiscount).toBe(50); // 10% of 500
    });

    test('should cap percentage discount at maximum', async () => {
      const medicineData = {
        sellingPrice: 500,
        mrp: 600,
        discount: 100,
        requiresPrescription: false
      };

      await cart.addItem(testMedicine1._id, 10, medicineData); // 5000 subtotal
      await cart.applyCoupon('SAVE10', 10, 'percentage');

      expect(cart.pricing.couponDiscount).toBe(200); // Capped at ₹200
    });

    test('should apply fixed coupon correctly', async () => {
      const medicineData = {
        sellingPrice: 100,
        mrp: 120,
        discount: 20,
        requiresPrescription: false
      };

      await cart.addItem(testMedicine1._id, 3, medicineData); // 300 subtotal
      await cart.applyCoupon('SAVE50', 50, 'fixed');

      expect(cart.pricing.couponDiscount).toBe(50);
    });

    test('should not exceed subtotal for fixed coupon', async () => {
      const medicineData = {
        sellingPrice: 30,
        mrp: 40,
        discount: 10,
        requiresPrescription: false
      };

      await cart.addItem(testMedicine1._id, 1, medicineData); // 30 subtotal
      await cart.applyCoupon('SAVE50', 50, 'fixed');

      expect(cart.pricing.couponDiscount).toBe(30); // Limited to subtotal
    });

    test('should remove coupon correctly', async () => {
      const medicineData = {
        sellingPrice: 100,
        mrp: 120,
        discount: 20,
        requiresPrescription: false
      };

      await cart.addItem(testMedicine1._id, 2, medicineData);
      await cart.applyCoupon('SAVE10', 10, 'percentage');
      
      expect(cart.pricing.couponDiscount).toBe(20);
      
      await cart.removeCoupon();
      
      expect(cart.appliedCoupon).toBeUndefined();
      expect(cart.pricing.couponDiscount).toBe(0);
    });

    test('should apply reward points correctly', async () => {
      const medicineData = {
        sellingPrice: 100,
        mrp: 120,
        discount: 20,
        requiresPrescription: false
      };

      await cart.addItem(testMedicine1._id, 5, medicineData); // 500 subtotal
      await cart.applyRewardPoints(100);

      // Max 10% of subtotal = 50
      expect(cart.pricing.rewardPointsUsed).toBe(50);
    });

    test('should calculate final amount correctly', async () => {
      const medicineData = {
        sellingPrice: 100,
        mrp: 120,
        discount: 20,
        requiresPrescription: false
      };

      await cart.addItem(testMedicine1._id, 2, medicineData); // 200 subtotal
      await cart.applyCoupon('SAVE10', 10, 'percentage'); // 20 discount
      await cart.applyRewardPoints(50); // 20 points used (max 10%)

      // Final = 200 (subtotal) + 40 (delivery) + 4 (platform) + 24 (gst) - 20 (coupon) - 20 (rewards)
      const expectedFinal = 200 + 40 + 4 + 24 - 20 - 20;
      expect(cart.pricing.finalAmount).toBe(expectedFinal);
    });

    test('should ensure final amount is not negative', async () => {
      const medicineData = {
        sellingPrice: 10,
        mrp: 15,
        discount: 5,
        requiresPrescription: false
      };

      await cart.addItem(testMedicine1._id, 1, medicineData); // 10 subtotal
      await cart.applyCoupon('SAVE100', 500, 'fixed'); // Large discount

      expect(cart.pricing.finalAmount).toBe(0);
    });

    test('should reset pricing when cart is empty', async () => {
      const medicineData = {
        sellingPrice: 100,
        mrp: 120,
        discount: 20,
        requiresPrescription: false
      };

      await cart.addItem(testMedicine1._id, 1, medicineData);
      await cart.clearCart();

      expect(cart.pricing.subtotal).toBe(0);
      expect(cart.pricing.totalMRP).toBe(0);
      expect(cart.pricing.finalAmount).toBe(0);
      expect(cart.requiresPrescription).toBe(false);
    });

    test('should detect prescription requirement', async () => {
      const medicineData = {
        sellingPrice: 90,
        mrp: 100,
        discount: 10,
        requiresPrescription: true
      };

      await cart.addItem(testMedicine2._id, 1, medicineData);

      expect(cart.requiresPrescription).toBe(true);
    });
  });

  describe('Static Methods', () => {
    test('should find or create cart for user', async () => {
      const cart1 = await Cart.findOrCreateCart(testUser._id);
      expect(cart1.user.toString()).toBe(testUser._id.toString());
      expect(cart1.items).toHaveLength(0);

      // Should return existing cart on second call
      const cart2 = await Cart.findOrCreateCart(testUser._id);
      expect(cart1._id.toString()).toBe(cart2._id.toString());
    });

    test('should get abandoned carts', async () => {
      // Create cart with old lastUpdated date
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 10); // 10 days ago

      const abandonedCart = await new Cart({
        user: testUser._id,
        items: [{
          medicine: testMedicine1._id,
          quantity: 1,
          price: 45,
          mrp: 50
        }],
        lastUpdated: oldDate,
        status: 'active'
      }).save();

      // Create recent cart
      const recentCart = await new Cart({
        user: testUser._id
      });
      // Need different user for second cart due to unique constraint
      const anotherUser = await new User({
        phoneNumber: '+9876543210',
        name: 'Another User'
      }).save();
      
      recentCart.user = anotherUser._id;
      await recentCart.save();

      const abandonedCarts = await Cart.getAbandonedCarts(7);
      
      expect(abandonedCarts).toHaveLength(1);
      expect(abandonedCarts[0]._id.toString()).toBe(abandonedCart._id.toString());
    });
  });

  describe('Pre-save Middleware', () => {
    test('should update lastUpdated on save', async () => {
      const cart = new Cart({ user: testUser._id });
      const originalTime = cart.lastUpdated;
      
      // Wait a moment to ensure time difference
      await new Promise(resolve => setTimeout(resolve, 10));
      
      await cart.save();
      
      expect(cart.lastUpdated.getTime()).toBeGreaterThan(originalTime.getTime());
    });

    test('should recalculate pricing when items are modified', async () => {
      const cart = await new Cart({ user: testUser._id }).save();
      
      // Add item directly to items array (simulating modification)
      cart.items.push({
        medicine: testMedicine1._id,
        quantity: 2,
        price: 45,
        mrp: 50
      });
      
      await cart.save();
      
      expect(cart.pricing.subtotal).toBe(90);
      expect(cart.pricing.totalMRP).toBe(100);
    });
  });

  describe('Default Values', () => {
    test('should set default values correctly', () => {
      const cart = new Cart({ user: testUser._id });

      expect(cart.status).toBe('active');
      expect(cart.estimatedDeliveryTime).toBe(30);
      expect(cart.requiresPrescription).toBe(false);
      expect(cart.pricing.subtotal).toBe(0);
      expect(cart.pricing.deliveryCharges).toBe(0);
      expect(cart.attachedPrescriptions).toHaveLength(0);
      expect(cart.expiresAt).toBeInstanceOf(Date);
    });
  });

  describe('JSON Serialization', () => {
    test('should include virtuals in JSON output', () => {
      const cart = new Cart({
        user: testUser._id,
        items: [{
          medicine: testMedicine1._id,
          quantity: 2,
          price: 45,
          mrp: 50
        }],
        pricing: { totalMRP: 100, subtotal: 90 }
      });

      const json = cart.toJSON();
      expect(json.totalItems).toBeDefined();
      expect(json.uniqueItems).toBeDefined();
      expect(json.totalSavings).toBeDefined();
      expect(json.hasPrescriptionItems).toBeDefined();
    });
  });
});