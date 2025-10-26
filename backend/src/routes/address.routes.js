const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const addressController = require('../controllers/address.controller');
const auth = require('../middleware/auth'); // adjust path/name to your project

router.use(auth);

// GET /api/addresses
router.get('/', addressController.getAddresses);

// POST /api/addresses
router.post('/', addressController.addAddress);

// PUT /api/addresses/:id
router.put('/:id', addressController.updateAddress);

// DELETE /api/addresses/:id
router.delete('/:id', addressController.deleteAddress);

// PATCH /api/addresses/:id/default
router.patch('/:id/default', addressController.setDefaultAddress);

module.exports = router;