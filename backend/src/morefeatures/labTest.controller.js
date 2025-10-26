// const LabTest = require('../models/LabTest');
// const { validationResult } = require('express-validator');

// // @desc    Get all lab tests with filtering and pagination
// // @route   GET /api/lab-tests
// // @access  Public
// exports.getLabTests = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const category = req.query.category;
//     const search = req.query.search;
//     const sortBy = req.query.sortBy || 'name';
//     const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
//     const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : 0;
//     const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : Infinity;

//     let query = { isActive: true };

//     // Add category filter
//     if (category && category !== 'all') {
//       query.category = category;
//     }

//     // Add price range filter
//     if (minPrice > 0 || maxPrice < Infinity) {
//       query['price.sellingPrice'] = {
//         $gte: minPrice,
//         $lte: maxPrice
//       };
//     }

//     let testsQuery;

//     if (search) {
//       // Text search
//       query.$text = { $search: search };
//       testsQuery = LabTest.find(query).sort({ score: { $meta: 'textScore' } });
//     } else {
//       // Regular sorting
//       const sortOptions = {};
//       if (sortBy === 'price') {
//         sortOptions['price.sellingPrice'] = sortOrder;
//       } else if (sortBy === 'rating') {
//         sortOptions['rating.average'] = sortOrder;
//       } else if (sortBy === 'popularity') {
//         sortOptions['orderCount'] = sortOrder;
//       } else {
//         sortOptions[sortBy] = sortOrder;
//       }
//       testsQuery = LabTest.find(query).sort(sortOptions);
//     }

//     const tests = await testsQuery
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .populate('metadata.relatedTests', 'name price category');

//     const total = await LabTest.countDocuments(query);
//     const totalPages = Math.ceil(total / limit);

//     res.status(200).json({
//       success: true,
//       tests,
//       pagination: {
//         currentPage: page,
//         totalPages,
//         totalTests: total,
//         hasNextPage: page < totalPages,
//         hasPrevPage: page > 1
//       }
//     });

//   } catch (error) {
//     console.error('Get Lab Tests Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch lab tests',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // @desc    Get single lab test by ID
// // @route   GET /api/lab-tests/:id
// // @access  Public
// exports.getLabTest = async (req, res) => {
//   try {
//     const test = await LabTest.findById(req.params.id)
//       .populate('metadata.relatedTests', 'name price category images');

//     if (!test) {
//       return res.status(404).json({
//         success: false,
//         message: 'Lab test not found'
//       });
//     }

//     // Increment view count
//     await test.incrementViewCount();

//     res.status(200).json({
//       success: true,
//       test
//     });

//   } catch (error) {
//     console.error('Get Lab Test Error:', error);
//     if (error.kind === 'ObjectId') {
//       return res.status(404).json({
//         success: false,
//         message: 'Lab test not found'
//       });
//     }
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch lab test',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // @desc    Get popular lab tests
// // @route   GET /api/lab-tests/popular
// // @access  Public
// exports.getPopularLabTests = async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 10;
//     const tests = await LabTest.getPopularTests(limit);

//     res.status(200).json({
//       success: true,
//       tests
//     });

//   } catch (error) {
//     console.error('Get Popular Lab Tests Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch popular lab tests',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // @desc    Get featured lab tests
// // @route   GET /api/lab-tests/featured
// // @access  Public
// exports.getFeaturedLabTests = async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 10;
//     const tests = await LabTest.getFeaturedTests(limit);

//     res.status(200).json({
//       success: true,
//       tests
//     });

//   } catch (error) {
//     console.error('Get Featured Lab Tests Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch featured lab tests',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // @desc    Get lab test categories
// // @route   GET /api/lab-tests/categories
// // @access  Public
// exports.getLabTestCategories = async (req, res) => {
//   try {
//     const categories = await LabTest.aggregate([
//       { $match: { isActive: true } },
//       {
//         $group: {
//           _id: '$category',
//           count: { $sum: 1 },
//           minPrice: { $min: '$price.sellingPrice' },
//           maxPrice: { $max: '$price.sellingPrice' },
//           avgRating: { $avg: '$rating.average' }
//         }
//       },
//       {
//         $project: {
//           category: '$_id',
//           count: 1,
//           priceRange: {
//             min: '$minPrice',
//             max: '$maxPrice'
//           },
//           avgRating: { $round: ['$avgRating', 1] },
//           _id: 0
//         }
//       },
//       { $sort: { count: -1 } }
//     ]);

//     // Add display names for categories
//     const categoryMap = {
//       'blood-test': 'Blood Tests',
//       'urine-test': 'Urine Tests',
//       'thyroid-test': 'Thyroid Tests',
//       'diabetes-test': 'Diabetes Tests',
//       'lipid-profile': 'Lipid Profile',
//       'liver-function': 'Liver Function',
//       'kidney-function': 'Kidney Function',
//       'cardiac-test': 'Cardiac Tests',
//       'vitamin-test': 'Vitamin Tests',
//       'hormone-test': 'Hormone Tests',
//       'cancer-screening': 'Cancer Screening',
//       'infectious-disease': 'Infectious Disease',
//       'allergy-test': 'Allergy Tests',
//       'health-checkup': 'Health Checkup',
//       'other': 'Other Tests'
//     };

//     const categoriesWithNames = categories.map(cat => ({
//       ...cat,
//       displayName: categoryMap[cat.category] || cat.category
//     }));

//     res.status(200).json({
//       success: true,
//       categories: categoriesWithNames
//     });

//   } catch (error) {
//     console.error('Get Lab Test Categories Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch lab test categories',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // @desc    Search lab tests
// // @route   GET /api/lab-tests/search
// // @access  Public
// exports.searchLabTests = async (req, res) => {
//   try {
//     const { q: query, category, minPrice, maxPrice, limit = 20 } = req.query;

//     if (!query || query.length < 2) {
//       return res.status(400).json({
//         success: false,
//         message: 'Search query must be at least 2 characters long'
//       });
//     }

//     const options = {
//       limit: parseInt(limit),
//       category,
//       priceRange: {
//         min: minPrice ? parseFloat(minPrice) : 0,
//         max: maxPrice ? parseFloat(maxPrice) : Infinity
//       }
//     };

//     const tests = await LabTest.searchTests(query, options);

//     res.status(200).json({
//       success: true,
//       tests,
//       searchQuery: query,
//       totalResults: tests.length
//     });

//   } catch (error) {
//     console.error('Search Lab Tests Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Search failed',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // ADMIN ONLY ROUTES

// // @desc    Create new lab test
// // @route   POST /api/lab-tests
// // @access  Private (Admin only)
// exports.createLabTest = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: errors.array()
//       });
//     }

//     const test = new LabTest(req.body);
//     await test.save();

//     res.status(201).json({
//       success: true,
//       message: 'Lab test created successfully',
//       test
//     });

//   } catch (error) {
//     console.error('Create Lab Test Error:', error);
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: 'Lab test with this code already exists'
//       });
//     }
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create lab test',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // @desc    Update lab test
// // @route   PUT /api/lab-tests/:id
// // @access  Private (Admin only)
// exports.updateLabTest = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: errors.array()
//       });
//     }

//     const test = await LabTest.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!test) {
//       return res.status(404).json({
//         success: false,
//         message: 'Lab test not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Lab test updated successfully',
//       test
//     });

//   } catch (error) {
//     console.error('Update Lab Test Error:', error);
//     if (error.kind === 'ObjectId') {
//       return res.status(404).json({
//         success: false,
//         message: 'Lab test not found'
//       });
//     }
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update lab test',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // @desc    Delete lab test
// // @route   DELETE /api/lab-tests/:id
// // @access  Private (Admin only)
// exports.deleteLabTest = async (req, res) => {
//   try {
//     const test = await LabTest.findByIdAndDelete(req.params.id);

//     if (!test) {
//       return res.status(404).json({
//         success: false,
//         message: 'Lab test not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Lab test deleted successfully'
//     });

//   } catch (error) {
//     console.error('Delete Lab Test Error:', error);
//     if (error.kind === 'ObjectId') {
//       return res.status(404).json({
//         success: false,
//         message: 'Lab test not found'
//       });
//     }
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete lab test',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // @desc    Bulk import lab tests
// // @route   POST /api/lab-tests/bulk-import
// // @access  Private (Admin only)
// exports.bulkImportLabTests = async (req, res) => {
//   try {
//     const { tests } = req.body;

//     if (!Array.isArray(tests) || tests.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide an array of lab tests'
//       });
//     }

//     const importedTests = await LabTest.insertMany(tests);

//     res.status(201).json({
//       success: true,
//       message: `Successfully imported ${importedTests.length} lab tests`,
//       count: importedTests.length
//     });

//   } catch (error) {
//     console.error('Bulk Import Lab Tests Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to import lab tests',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };