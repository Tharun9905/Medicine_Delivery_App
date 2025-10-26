// Modified payment.controller.js
const Payment = require('../models/Payment');
const Order = require('../models/Order');

// Initialize Stripe with better error handling
let stripe;
try {
  // Check if we're in mock payment mode
  const mockPayment = process.env.MOCK_PAYMENT === 'true';
  
  if (!mockPayment && process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    console.log('Stripe initialized successfully');
  } else {
    console.log('Using mock payment mode - no actual payments will be processed');
  }
} catch (error) {
  console.error('Failed to initialize Stripe:', error);
}

// Mock payment functions
const mockStripe = {
  paymentIntents: {
    create: async (options) => {
      console.log('MOCK: Creating payment intent', options);
      return {
        id: 'mock_payment_' + Date.now(),
        client_secret: 'mock_secret_' + Date.now(),
        amount: options.amount,
        currency: options.currency,
        status: 'succeeded'
      };
    },
    retrieve: async (id) => {
      console.log('MOCK: Retrieving payment intent', id);
      return {
        id,
        status: 'succeeded',
        amount: 10000 // $100.00
      };
    }
  }
};

// Use mock or real Stripe
const paymentProcessor = stripe || mockStripe;

exports.createPaymentIntent = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const order = await Order.findById(orderId);
    if (!order || order.user.toString() !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const paymentIntent = await paymentProcessor.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'inr',
      metadata: {
        orderId: orderId,
        userId: req.user.id
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Create Payment Intent Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    const paymentIntent = await paymentProcessor.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          'payment.status': 'Completed',
          'payment.transactionId': paymentIntentId,
          'payment.paidAt': new Date(),
          'pricing.paidAmount': paymentIntent.amount / 100
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Payment confirmed successfully',
        order
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not successful'
      });
    }
  } catch (error) {
    console.error('Confirm Payment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const { orderId, method, meta } = req.body;
    if (!orderId) return res.status(400).json({ success: false, message: 'orderId is required' });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Create payment record (mock behavior)
    const payment = new Payment({
      order: order._id,
      user: req.user.id,
      amount: order.total,
      method: method || 'online',
      status: method === 'online' ? 'pending' : 'completed',
      meta
    });
    await payment.save();

    // attach payment to order
    order.payment = payment._id;
    if (payment.status === 'completed') order.status = 'confirmed';
    await order.save();

    const populated = await Payment.findById(payment._id).populate('order');
    if (global.io) global.io.to(`order_${order._id}`).emit('paymentCreated', populated);

    res.status(201).json({ success: true, message: 'Payment created', payment: populated });
  } catch (err) {
    console.error('Create Payment Error:', err);
    res.status(500).json({ success: false, message: 'Failed to create payment', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId, providerId, status } = req.body;
    if (!paymentId) return res.status(400).json({ success: false, message: 'paymentId is required' });

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    payment.providerId = providerId || payment.providerId;
    payment.status = status || 'completed';
    await payment.save();

    // update order status on successful payment
    if (payment.status === 'completed' && payment.order) {
      await Order.findByIdAndUpdate(payment.order, { status: 'confirmed' }, { new: true });
      if (global.io) global.io.to(`order_${payment.order}`).emit('paymentVerified', payment);
    }

    res.status(200).json({ success: true, message: 'Payment verified', payment });
  } catch (err) {
    console.error('Verify Payment Error:', err);
    res.status(500).json({ success: false, message: 'Failed to verify payment', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const query = {};
    if (!req.user.isAdmin) query.user = req.user.id;
    const payments = await Payment.find(query).populate('order').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: payments.length, payments });
  } catch (err) {
    console.error('Get Payments Error:', err);
    res.status(500).json({ success: false, message: 'Failed to get payments', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('order');
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    if (!req.user.isAdmin && payment.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Forbidden' });
    res.status(200).json({ success: true, payment });
  } catch (err) {
    console.error('Get Payment Error:', err);
    res.status(500).json({ success: false, message: 'Failed to get payment', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};
