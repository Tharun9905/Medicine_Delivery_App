const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicine.controller');
// const auth = require('../middleware/auth'); // not required for public listings

// GET /api/medicines - list, supports ?search=&category=&limit=&page=
router.get('/', medicineController.getMedicines);

// GET /api/medicines/search - search medicines
router.get('/search', medicineController.searchMedicines);

// GET /api/medicines/categories
router.get('/categories', medicineController.getCategories);

// GET /api/medicines/brands
router.get('/brands', medicineController.getBrands);

// GET /api/medicines/popular
router.get('/popular', medicineController.getPopular);

// GET /api/medicines/featured
router.get('/featured', medicineController.getFeatured);

// GET /api/medicines/new-arrivals
router.get('/new-arrivals', medicineController.getNewArrivals);

// GET /api/medicines/recommendations
router.get('/recommendations', medicineController.getRecommendations);

// GET /api/medicines/:id
router.get('/:id', medicineController.getMedicine);

// GET /api/medicines/:id/availability
router.get('/:id/availability', medicineController.checkAvailability);

module.exports = router;