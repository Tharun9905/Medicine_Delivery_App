const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const auth = require('../middleware/auth');

// create order
router.post('/', auth, orderController.createOrder);

// list user orders
router.get('/', auth, orderController.getOrdersByUser);

// get single
router.get('/:id', auth, orderController.getOrder);

// update status (admin)
router.patch('/:id/status', auth, orderController.updateStatus);

// cancel (user)
router.delete('/:id', auth, orderController.cancelOrder);

module.exports = router;