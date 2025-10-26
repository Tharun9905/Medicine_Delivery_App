const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const auth = require('../middleware/auth');

router.get('/', auth, cartController.getCart);
router.post('/add', auth, cartController.addItem);
router.put('/update/:id', auth, cartController.updateItem);
router.delete('/remove/:id', auth, cartController.removeItem);
router.delete('/clear', auth, cartController.clearCart);

module.exports = router;