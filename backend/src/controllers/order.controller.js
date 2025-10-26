const safeRequire = (p) => { try { return require(p); } catch (e) { console.error('Error loading module', p, ':', e.message); return null; } };
const Order = require('../models/Order');
const Cart = safeRequire('../models/Cart');
const Address = safeRequire('../models/Address');

const getUserId = (req) => {
  if (!req) return null;
  if (req.user) return req.user.id || req.user._id || null;
  if (req.headers && req.headers['x-user-id']) return req.headers['x-user-id'];
  return null;
};

exports.createOrder = async (req, res) => {
  console.log('Order model:', !!Order, typeof Order);
  if (!Order) return res.status(501).json({ success: false, message: 'Order model not implemented' });
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  try {
    // allow creating from cart or from provided items
    let items = req.body.items;
    if ((!items || items.length === 0) && Cart) {
      const cart = await Cart.findOne({ user: userId }).populate('items.medicine');
      if (cart && cart.items.length) {
        items = cart.items.map(i => ({
          medicine: i.medicine ? i.medicine._id : i.medicine,
          name: i.name || (i.medicine && i.medicine.name) || '',
          quantity: i.quantity,
          price: i.price
        }));
      }
    }

    if (!items || items.length === 0) return res.status(400).json({ success: false, message: 'No items to create order' });

    const deliveryAddressId = req.body.deliveryAddress || (req.body.deliveryAddressId);
    if (!deliveryAddressId && !Address) return res.status(400).json({ success: false, message: 'Delivery address is required' });

    // snapshot address if model exists
    let addressSnapshot = null;
    if (Address && deliveryAddressId) {
      const addr = await Address.findById(deliveryAddressId);
      if (addr) {
        addressSnapshot = {
          label: addr.label,
          addressLine1: addr.addressLine1 || addr.line1 || '',
          addressLine2: addr.addressLine2 || addr.line2 || '',
          landmark: addr.landmark || '',
          city: addr.city || '',
          state: addr.state || '',
          pincode: addr.pincode || '',
          coordinates: addr.coordinates || []
        };
      }
    }

    // build pricing if not provided
    const pricing = req.body.pricing || {};
    if (!pricing.totalAmount) {
      const subtotal = items.reduce((s, it) => s + ((it.price || 0) * (it.quantity || 1)), 0);
      pricing.subtotal = subtotal;
      pricing.totalAmount = subtotal + (pricing.deliveryCharges || 0) - (pricing.couponDiscount || 0);
    }

    // Generate order number
    const timestamp = Date.now().toString().slice(-8);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderNumber = `MQ${timestamp}${randomNum}`;

    const orderData = {
      orderNumber,
      user: userId,
      items,
      deliveryAddress: deliveryAddressId,
      addressSnapshot,
      pricing,
      source: req.body.source || 'web',
      payment: req.body.payment || { method: 'COD', status: 'Pending' },
      customerInfo: req.body.customerInfo || undefined,
      prescriptions: req.body.prescriptions || [],
      requiresPrescription: req.body.requiresPrescription || false
    };

    console.log('Creating order with data:', JSON.stringify(orderData, null, 2));
    const order = new Order(orderData);
    console.log('Order before save:', { orderNumber: order.orderNumber, hasOrderNumber: !!order.orderNumber });
    await order.save();
    console.log('Order after save:', { orderNumber: order.orderNumber, hasOrderNumber: !!order.orderNumber });

    // clear cart if requested
    if (req.body.clearCart && Cart) {
      await Cart.findOneAndUpdate({ user: userId }, { items: [], subtotal: 0 });
    }

    // emit via socket
    if (global.io) {
      global.io.to(`order_${order._id}`).emit('orderCreated', { orderId: order._id, orderNumber: order.orderNumber });
      global.io.to(`user_${userId}`).emit('orderUpdate', { orderId: order._id, status: order.status });
    }

    const populated = await Order.findById(order._id).populate('items.medicine', 'name price images').populate('deliveryAddress');
    res.status(201).json({ success: true, message: 'Order created', order: populated });
  } catch (err) {
    console.error('Create Order Error:', err);
    res.status(500).json({ success: false, message: 'Failed to create order', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};

exports.getOrder = async (req, res) => {
  if (!Order) return res.status(501).json({ success: false, message: 'Order model not implemented' });
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
  try {
    const order = await Order.findById(req.params.id).populate('items.medicine', 'name price images').populate('deliveryAddress');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    // allow admin access if req.user.isAdmin else ensure owner
    if (!(req.user && req.user.isAdmin) && order.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error('Get Order Error:', err);
    res.status(500).json({ success: false, message: 'Failed to get order', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};

exports.getOrdersByUser = async (req, res) => {
  if (!Order) return res.status(501).json({ success: false, message: 'Order model not implemented' });
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
  try {
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).limit(parseInt(req.query.limit || 50, 10));
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (err) {
    console.error('Get Orders By User Error:', err);
    res.status(500).json({ success: false, message: 'Failed to get orders', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};

exports.getOrders = async (req, res) => {
  if (!Order) return res.status(501).json({ success: false, message: 'Order model not implemented' });
  // require admin
  if (!(req.user && req.user.isAdmin)) return res.status(403).json({ success: false, message: 'Forbidden' });
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.userId) filter.user = req.query.userId;
    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(parseInt(req.query.limit || 100, 10));
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (err) {
    console.error('Get Orders Error:', err);
    res.status(500).json({ success: false, message: 'Failed to get orders', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};

exports.updateStatus = async (req, res) => {
  if (!Order) return res.status(501).json({ success: false, message: 'Order model not implemented' });
  // admin or owner may update depending on use-case; here require admin
  if (!(req.user && req.user.isAdmin)) return res.status(403).json({ success: false, message: 'Forbidden' });
  const { status, remarks, location } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    await order.updateStatus(status, remarks, location, req.user._id || req.user.id);
    const updated = await Order.findById(order._id).populate('deliveryAddress').populate('items.medicine');
    res.status(200).json({ success: true, message: 'Order status updated', order: updated });
  } catch (err) {
    console.error('Update Order Status Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update order status', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};

exports.cancelOrder = async (req, res) => {
  if (!Order) return res.status(501).json({ success: false, message: 'Order model not implemented' });
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    // allow owner or admin
    if (!(req.user && req.user.isAdmin) && order.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    await order.cancelOrder(req.body.reason || 'Cancelled by user', req.user && req.user.isAdmin ? 'admin' : 'customer', req.body.refundAmount);
    res.status(200).json({ success: true, message: 'Order cancelled', order });
  } catch (err) {
    console.error('Cancel Order Error:', err);
    res.status(500).json({ success: false, message: 'Failed to cancel order', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};

exports.assignDeliveryPartner = async (req, res) => {
  if (!Order) return res.status(501).json({ success: false, message: 'Order model not implemented' });
  if (!(req.user && req.user.isAdmin)) return res.status(403).json({ success: false, message: 'Forbidden' });
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    await order.assignDeliveryPartner(req.body.partnerInfo || {});
    const updated = await Order.findById(order._id).populate('deliveryAddress').populate('items.medicine');
    res.status(200).json({ success: true, message: 'Delivery partner assigned', order: updated });
  } catch (err) {
    console.error('Assign Delivery Partner Error:', err);
    res.status(500).json({ success: false, message: 'Failed to assign delivery partner', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};

exports.markAsDelivered = async (req, res) => {
  if (!Order) return res.status(501).json({ success: false, message: 'Order model not implemented' });
  if (!(req.user && req.user.isAdmin)) return res.status(403).json({ success: false, message: 'Forbidden' });
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    await order.markAsDelivered(req.body.deliveredBy, req.body.receivedBy, req.body.images);
    const updated = await Order.findById(order._id).populate('items.medicine').populate('deliveryAddress');
    res.status(200).json({ success: true, message: 'Order marked as delivered', order: updated });
  } catch (err) {
    console.error('Mark As Delivered Error:', err);
    res.status(500).json({ success: false, message: 'Failed to mark order as delivered', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};