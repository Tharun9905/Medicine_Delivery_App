const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const auth = require('../middleware/auth');

router.get('/', auth, wishlistController.getWishlist);
router.post('/', auth, wishlistController.addToWishlist);
router.delete('/item/:medicineId', auth, wishlistController.removeFromWishlist);
router.delete('/', auth, wishlistController.clearWishlist);

module.exports = router;