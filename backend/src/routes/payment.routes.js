const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const auth = require('../middleware/auth');

router.post('/', auth, paymentController.createPayment);
router.post('/verify', auth, paymentController.verifyPayment);
router.get('/', auth, paymentController.getPayments);
router.get('/:id', auth, paymentController.getPayment);

module.exports = router;