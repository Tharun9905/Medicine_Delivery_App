// const express = require('express');
// const router = express.Router();
// const { body } = require('express-validator');
// const {
//   getLabTests,
//   getLabTest,
//   getPopularLabTests,
//   getFeaturedLabTests,
//   getLabTestCategories,
//   searchLabTests,
//   createLabTest,
//   updateLabTest,
//   deleteLabTest,
//   bulkImportLabTests
// } = require('../controllers/labTest.controller');
// const auth = require('../middleware/auth.middleware');
// const adminAuth = require('../middleware/adminAuth');

// // Validation middleware
// const validateLabTest = [
//   body('name')
//     .trim()
//     .isLength({ min: 2, max: 100 })
//     .withMessage('Name must be between 2 and 100 characters'),
  
//   body('code')
//     .trim()
//     .isLength({ min: 2, max: 20 })
//     .withMessage('Code must be between 2 and 20 characters'),
  
//   body('description')
//     .trim()
//     .isLength({ min: 10, max: 500 })
//     .withMessage('Description must be between 10 and 500 characters'),
  
//   body('category')
//     .isIn([
//       'blood-test', 'urine-test', 'thyroid-test', 'diabetes-test',
//       'lipid-profile', 'liver-function', 'kidney-function', 'cardiac-test',
//       'vitamin-test', 'hormone-test', 'cancer-screening', 'infectious-disease',
//       'allergy-test', 'health-checkup', 'other'
//     ])
//     .withMessage('Invalid category'),
  
//   body('price.mrp')
//     .isFloat({ min: 0 })
//     .withMessage('MRP must be a positive number'),
  
//   body('price.sellingPrice')
//     .isFloat({ min: 0 })
//     .withMessage('Selling price must be a positive number'),
  
//   body('sampleType')
//     .isArray({ min: 1 })
//     .withMessage('At least one sample type is required'),
  
//   body('reportTime.value')
//     .isInt({ min: 1 })
//     .withMessage('Report time value must be at least 1'),
  
//   body('reportTime.unit')
//     .isIn(['hours', 'days', 'weeks'])
//     .withMessage('Report time unit must be hours, days, or weeks')
// ];

// // Public routes
// router.get('/categories', getLabTestCategories);
// router.get('/popular', getPopularLabTests);
// router.get('/featured', getFeaturedLabTests);
// router.get('/search', searchLabTests);
// router.get('/:id', getLabTest);
// router.get('/', getLabTests);

// // Admin only routes - temporarily disabled for testing
// // router.post('/', auth, createLabTest);
// // router.put('/:id', auth, updateLabTest);
// // router.delete('/:id', auth, deleteLabTest);
// // router.post('/bulk-import', auth, bulkImportLabTests);

// module.exports = router;