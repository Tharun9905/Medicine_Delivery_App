const Order = require('../../src/models/Order');
const User = require('../../src/models/User');
const Medicine = require('../../src/models/Medicine');
const Address = require('../../src/models/Address');

describe('Order Model', () => {
  let testUser;
  let testMedicine;
  let testAddress;

  beforeEach(async () => {
    // Create test user
    testUser = await new User({
      phoneNumber: '+1234567890',
      name: 'Test User',
      email: 'test@example.com'
    }).save();

    // Create test medicine
    testMedicine = await new Medicine({
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
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    }).save();

    // Create test address
    testAddress = await new Address({
      user: testUser._id,
      contactPerson: 'Test User',
      phoneNumber: '+1234567890',
      addressLine1: '123 Test Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      location: {
        coordinates: [72.8777, 19.0760]
      }
    }).save();
  });

  const validOrderData = {
    items: [{
      medicine: null, // Will be set in tests
      name: 'Paracetamol',
      brand: 'Crocin',
      quantity: 2,
      price: 45,
      mrp: 50,
      discount: 10
    }],
    pricing: {
      subtotal: 90,
      totalAmount: 150,
      deliveryCharges: 40,
      gst: 11,
      platformFee: 2
    },
    payment: {
      method: 'UPI'
    }
  };

  describe('Order Schema Validation', () => {
    test('should create order with valid data', async () => {
      const orderData = {
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }]
      };

      const order = new Order(orderData);
      const savedOrder = await order.save();

      expect(savedOrder.user.toString()).toBe(testUser._id.toString());
      expect(savedOrder.items).toHaveLength(1);
      expect(savedOrder.status).toBe('Placed');
      expect(savedOrder.payment.status).toBe('Pending');
      expect(savedOrder.orderNumber).toMatch(/^MQ\d{11}$/);
    });

    test('should require user reference', async () => {
      const orderData = {
        ...validOrderData,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }]
      };

      const order = new Order(orderData);
      await expect(order.save()).rejects.toThrow('User reference is required');
    });

    test('should require delivery address', async () => {
      const orderData = {
        ...validOrderData,
        user: testUser._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }]
      };

      const order = new Order(orderData);
      await expect(order.save()).rejects.toThrow('Delivery address is required');
    });

    test('should require payment method', async () => {
      const orderData = {
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }],
        payment: {}
      };

      const order = new Order(orderData);
      await expect(order.save()).rejects.toThrow('Payment method is required');
    });

    test('should require subtotal', async () => {
      const orderData = {
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }],
        pricing: {
          ...validOrderData.pricing,
          subtotal: undefined
        }
      };

      const order = new Order(orderData);
      await expect(order.save()).rejects.toThrow('Subtotal is required');
    });

    test('should require total amount', async () => {
      const orderData = {
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }],
        pricing: {
          ...validOrderData.pricing,
          totalAmount: undefined
        }
      };

      const order = new Order(orderData);
      await expect(order.save()).rejects.toThrow('Total amount is required');
    });

    test('should validate payment method enum', async () => {
      const orderData = {
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }],
        payment: {
          method: 'InvalidMethod'
        }
      };

      const order = new Order(orderData);
      await expect(order.save()).rejects.toThrow();
    });

    test('should validate order status enum', async () => {
      const orderData = {
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }],
        status: 'InvalidStatus'
      };

      const order = new Order(orderData);
      await expect(order.save()).rejects.toThrow();
    });

    test('should validate item quantity', async () => {
      const orderData = {
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id,
          quantity: 0 // Invalid quantity
        }]
      };

      const order = new Order(orderData);
      await expect(order.save()).rejects.toThrow('Quantity must be at least 1');
    });

    test('should validate item price', async () => {
      const orderData = {
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id,
          price: -10 // Negative price
        }]
      };

      const order = new Order(orderData);
      await expect(order.save()).rejects.toThrow('Price cannot be negative');
    });

    test('should require item medicine reference', async () => {
      const orderData = {
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0]
          // Missing medicine reference
        }]
      };

      const order = new Order(orderData);
      await expect(order.save()).rejects.toThrow('Medicine reference is required');
    });

    test('should require item name', async () => {
      const orderData = {
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id,
          name: undefined
        }]
      };

      const order = new Order(orderData);
      await expect(order.save()).rejects.toThrow('Medicine name is required');
    });

    test('should enforce unique order number', async () => {
      const orderData1 = {
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        orderNumber: 'UNIQUE123',
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }]
      };

      const orderData2 = {
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        orderNumber: 'UNIQUE123',
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }]
      };

      await new Order(orderData1).save();
      
      const duplicateOrder = new Order(orderData2);
      await expect(duplicateOrder.save()).rejects.toThrow();
    });
  });

  describe('Virtual Properties', () => {
    test('should calculate total items', async () => {
      const order = new Order({
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [
          {
            ...validOrderData.items[0],
            medicine: testMedicine._id,
            quantity: 2
          },
          {
            ...validOrderData.items[0],
            medicine: testMedicine._id,
            name: 'Different Medicine',
            quantity: 3
          }
        ]
      });

      expect(order.totalItems).toBe(5); // 2 + 3
    });

    test('should return current status from status history', async () => {
      const order = new Order({
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }],
        status: 'Placed',
        statusHistory: [{
          status: 'Confirmed',
          timestamp: new Date()
        }]
      });

      expect(order.currentStatus).toBe('Confirmed');
    });

    test('should return order status when no status history', async () => {
      const order = new Order({
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }],
        status: 'Placed'
      });

      expect(order.currentStatus).toBe('Placed');
    });

    test('should check if order is delivered', async () => {
      const deliveredOrder = new Order({
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }],
        status: 'Delivered'
      });

      const pendingOrder = new Order({
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }],
        status: 'Placed'
      });

      expect(deliveredOrder.isDelivered).toBe(true);
      expect(pendingOrder.isDelivered).toBe(false);
    });

    test('should check if order is cancelled', async () => {
      const cancelledOrder = new Order({
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }],
        status: 'Cancelled'
      });

      const activeOrder = new Order({
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }],
        status: 'Placed'
      });

      expect(cancelledOrder.isCancelled).toBe(true);
      expect(activeOrder.isCancelled).toBe(false);
    });

    test('should check if order can be cancelled', async () => {
      const cancellableOrder = new Order({
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }],
        status: 'Placed'
      });

      const nonCancellableOrder = new Order({
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }],
        status: 'Delivered'
      });

      expect(cancellableOrder.canBeCancelled).toBe(true);
      expect(nonCancellableOrder.canBeCancelled).toBe(false);
    });

    test('should check if order can be returned - within return window', async () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 3); // 3 days ago

      const returnable = new Order({
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }],
        status: 'Delivered',
        delivery: {
          actualDeliveryTime: recentDate
        }
      });

      expect(returnable.canBeReturned).toBe(true);
    });

    test('should check if order can be returned - outside return window', async () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 10); // 10 days ago

      const nonReturnable = new Order({
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }],
        status: 'Delivered',
        delivery: {
          actualDeliveryTime: oldDate
        }
      });

      expect(nonReturnable.canBeReturned).toBe(false);
    });

    test('should not allow return for non-delivered orders', async () => {
      const nonDelivered = new Order({
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }],
        status: 'Processing'
      });

      expect(nonDelivered.canBeReturned).toBe(false);
    });
  });

  describe('Instance Methods', () => {
    let order;

    beforeEach(async () => {
      order = await new Order({
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }]
      }).save();
    });

    test('should update order status', async () => {
      await order.updateStatus('Confirmed', 'Order confirmed by admin');

      expect(order.status).toBe('Confirmed');
      expect(order.statusHistory).toHaveLength(1);
      expect(order.statusHistory[0].status).toBe('Confirmed');
      expect(order.statusHistory[0].remarks).toBe('Order confirmed by admin');
    });

    test('should update status with location', async () => {
      const location = {
        type: 'Point',
        coordinates: [72.8777, 19.0760]
      };

      await order.updateStatus('Out for Delivery', 'Out for delivery', location);

      expect(order.statusHistory[0].location).toEqual(location);
    });

    test('should assign delivery partner', async () => {
      const partnerInfo = {
        name: 'John Doe',
        phone: '+1234567890',
        vehicleNumber: 'MH01AB1234',
        partnerId: 'PARTNER001'
      };

      await order.assignDeliveryPartner(partnerInfo);

      expect(order.delivery.partner).toEqual(partnerInfo);
      expect(order.delivery.deliveryOTP).toMatch(/^\d{4}$/);
    });

    test('should mark order as delivered', async () => {
      const deliveredBy = 'John Delivery';
      const receivedBy = 'Jane Customer';
      const images = ['delivery1.jpg', 'delivery2.jpg'];

      await order.markAsDelivered(deliveredBy, receivedBy, images);

      expect(order.status).toBe('Delivered');
      expect(order.delivery.deliveredBy).toBe(deliveredBy);
      expect(order.delivery.receivedBy).toBe(receivedBy);
      expect(order.delivery.deliveryImages).toEqual(images);
      expect(order.delivery.actualDeliveryTime).toBeInstanceOf(Date);
      expect(order.statusHistory).toHaveLength(1);
      expect(order.statusHistory[0].status).toBe('Delivered');
    });

    test('should cancel order', async () => {
      const reason = 'Customer requested cancellation';
      const cancelledBy = 'customer';
      const refundAmount = 100;

      await order.cancelOrder(reason, cancelledBy, refundAmount);

      expect(order.status).toBe('Cancelled');
      expect(order.cancellation.reason).toBe(reason);
      expect(order.cancellation.cancelledBy).toBe(cancelledBy);
      expect(order.cancellation.refundAmount).toBe(refundAmount);
      expect(order.cancellation.cancelledAt).toBeInstanceOf(Date);
      expect(order.statusHistory).toHaveLength(1);
      expect(order.statusHistory[0].status).toBe('Cancelled');
    });

    test('should cancel order with default refund amount', async () => {
      order.pricing.paidAmount = 150;
      await order.save();

      await order.cancelOrder('Out of stock', 'admin');

      expect(order.cancellation.refundAmount).toBe(150); // Should use paid amount
    });

    test('should process full refund', async () => {
      order.pricing.paidAmount = 150;
      await order.save();

      await order.processRefund(150);

      expect(order.payment.status).toBe('Refunded');
      expect(order.payment.refundAmount).toBe(150);
      expect(order.payment.refundedAt).toBeInstanceOf(Date);
    });

    test('should process partial refund', async () => {
      order.pricing.paidAmount = 150;
      await order.save();

      await order.processRefund(75);

      expect(order.payment.status).toBe('Partially Refunded');
      expect(order.payment.refundAmount).toBe(75);
    });

    test('should accumulate multiple refunds', async () => {
      order.pricing.paidAmount = 150;
      order.payment.refundAmount = 50; // Existing refund
      await order.save();

      await order.processRefund(25); // Additional refund

      expect(order.payment.refundAmount).toBe(75); // 50 + 25
    });

    test('should add customer rating', async () => {
      const rating = 5;
      const review = 'Excellent service and fast delivery!';

      await order.addCustomerRating(rating, review);

      expect(order.customerRating.rating).toBe(rating);
      expect(order.customerRating.review).toBe(review);
      expect(order.customerRating.ratedAt).toBeInstanceOf(Date);
    });
  });

  describe('Pre-save Middleware', () => {
    test('should generate order number if not provided', async () => {
      const order = new Order({
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }]
      });

      await order.save();
      expect(order.orderNumber).toMatch(/^MQ\d{11}$/);
    });

    test('should not override existing order number', async () => {
      const customOrderNumber = 'CUSTOM123';
      const order = new Order({
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        orderNumber: customOrderNumber,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }]
      });

      await order.save();
      expect(order.orderNumber).toBe(customOrderNumber);
    });

    test('should generate delivery OTP when status is Out for Delivery', async () => {
      const order = new Order({
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        status: 'Out for Delivery',
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }]
      });

      await order.save();
      expect(order.delivery.deliveryOTP).toMatch(/^\d{4}$/);
    });

    test('should not generate OTP if already exists', async () => {
      const existingOTP = '1234';
      const order = new Order({
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        status: 'Out for Delivery',
        delivery: {
          deliveryOTP: existingOTP
        },
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }]
      });

      await order.save();
      expect(order.delivery.deliveryOTP).toBe(existingOTP);
    });
  });

  describe('Static Methods', () => {
    let testOrder1, testOrder2, testOrder3;

    beforeEach(async () => {
      // Create different users for testing
      const user2 = await new User({
        phoneNumber: '+9876543210',
        name: 'User 2'
      }).save();

      const address2 = await new Address({
        user: user2._id,
        contactPerson: 'User 2',
        phoneNumber: '+9876543210',
        addressLine1: '456 Second Street',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        location: {
          coordinates: [77.2090, 28.6139]
        }
      }).save();

      testOrder1 = await new Order({
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        status: 'Placed',
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }]
      }).save();

      testOrder2 = await new Order({
        ...validOrderData,
        user: user2._id,
        deliveryAddress: address2._id,
        status: 'Delivered',
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }]
      }).save();

      testOrder3 = await new Order({
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        status: 'Cancelled',
        requiresPrescription: true,
        prescriptionVerified: false,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }]
      }).save();
    });

    test('should get orders by status', async () => {
      const placedOrders = await Order.getOrdersByStatus('Placed');
      const deliveredOrders = await Order.getOrdersByStatus('Delivered');

      expect(placedOrders).toHaveLength(1);
      expect(placedOrders[0]._id.toString()).toBe(testOrder1._id.toString());
      
      expect(deliveredOrders).toHaveLength(1);
      expect(deliveredOrders[0]._id.toString()).toBe(testOrder2._id.toString());
    });

    test('should get orders by user', async () => {
      const userOrders = await Order.getOrdersByUser(testUser._id);
      
      expect(userOrders).toHaveLength(2);
      expect(userOrders[0]._id.toString()).toBe(testOrder3._id.toString()); // Most recent first
      expect(userOrders[1]._id.toString()).toBe(testOrder1._id.toString());
    });

    test('should limit user orders', async () => {
      const limitedOrders = await Order.getOrdersByUser(testUser._id, 1);
      
      expect(limitedOrders).toHaveLength(1);
    });

    test('should get orders requiring prescription', async () => {
      const prescriptionOrders = await Order.getOrdersRequiringPrescription();
      
      expect(prescriptionOrders).toHaveLength(1);
      expect(prescriptionOrders[0]._id.toString()).toBe(testOrder3._id.toString());
    });

    test('should get todays orders', async () => {
      const todaysOrders = await Order.getTodaysOrders();
      
      // All test orders were created today
      expect(todaysOrders).toHaveLength(3);
    });

    test('should get order statistics', async () => {
      const stats = await Order.getOrderStats();
      
      expect(stats).toHaveLength(1);
      expect(stats[0].totalOrders).toBe(3);
      expect(stats[0].deliveredOrders).toBe(1);
      expect(stats[0].cancelledOrders).toBe(1);
      expect(stats[0].totalRevenue).toBe(450); // 3 orders × 150 total amount each
      expect(stats[0].averageOrderValue).toBe(150);
    });

    test('should get order statistics for date range', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const stats = await Order.getOrderStats(yesterday, tomorrow);
      
      expect(stats).toHaveLength(1);
      expect(stats[0].totalOrders).toBe(3);
    });

    test('should return empty stats for invalid date range', async () => {
      const futureStart = new Date();
      futureStart.setDate(futureStart.getDate() + 10);
      
      const futureEnd = new Date();
      futureEnd.setDate(futureEnd.getDate() + 20);

      const stats = await Order.getOrderStats(futureStart, futureEnd);
      
      expect(stats).toHaveLength(0);
    });
  });

  describe('Default Values', () => {
    test('should set default values correctly', () => {
      const order = new Order({
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id
        }]
      });

      expect(order.status).toBe('Placed');
      expect(order.payment.status).toBe('Pending');
      expect(order.requiresPrescription).toBe(false);
      expect(order.prescriptionVerified).toBe(false);
      expect(order.source).toBe('web');
      expect(order.priority).toBe('normal');
      expect(order.pricing.couponDiscount).toBe(0);
      expect(order.pricing.rewardPointsUsed).toBe(0);
      expect(order.pricing.paidAmount).toBe(0);
      expect(order.delivery.type).toBe('standard');
    });
  });

  describe('JSON Serialization', () => {
    test('should include virtuals in JSON output', async () => {
      const order = new Order({
        ...validOrderData,
        user: testUser._id,
        deliveryAddress: testAddress._id,
        items: [{
          ...validOrderData.items[0],
          medicine: testMedicine._id,
          quantity: 3
        }],
        status: 'Delivered',
        statusHistory: [{
          status: 'Confirmed',
          timestamp: new Date()
        }]
      });

      const json = order.toJSON();
      expect(json.totalItems).toBeDefined();
      expect(json.currentStatus).toBeDefined();
      expect(json.isDelivered).toBeDefined();
      expect(json.canBeCancelled).toBeDefined();
      expect(json.canBeReturned).toBeDefined();
    });
  });
});