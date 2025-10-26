const request = require('supertest');
const express = require('express');
const Medicine = require('../../src/models/Medicine');
const User = require('../../src/models/User');
const Order = require('../../src/models/Order');
const { 
  getMedicines, 
  searchMedicines, 
  getPopularMedicines, 
  getRecommendations,
  getCategories,
  getBrands,
  getMedicine
} = require('../../src/controllers/medicine.controller');

// Mock express-validator
jest.mock('express-validator', () => ({
  validationResult: jest.fn(() => ({
    isEmpty: () => true,
    array: () => []
  }))
}));

// Mock mongoose paginate
const mockPaginate = jest.fn();
Medicine.paginate = mockPaginate;

// Create express app for testing
const app = express();
app.use(express.json());

// Mock auth middleware
const mockAuth = (req, res, next) => {
  req.user = { id: req.headers['user-id'] };
  next();
};

// Routes for testing
app.get('/medicines', getMedicines);
app.get('/medicines/search', searchMedicines);
app.get('/medicines/popular', getPopularMedicines);
app.get('/medicines/recommendations', mockAuth, getRecommendations);
app.get('/medicines/categories', getCategories);
app.get('/medicines/brands', getBrands);
app.get('/medicines/:id', getMedicine);

describe('Medicine Controller', () => {
  const sampleMedicine = {
    _id: '64a7c9e5f123456789abcdef',
    name: 'Paracetamol',
    brand: 'Crocin',
    manufacturer: 'GSK',
    category: 'OTC',
    dosageForm: 'Tablet',
    strength: '500mg',
    packSize: '10 tablets',
    mrp: 50,
    sellingPrice: 45,
    stock: 100,
    status: 'active',
    rating: { average: 4.5, count: 20 },
    salesCount: 150,
    isPopular: true,
    sku: 'MED001'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /medicines', () => {
    test('should get medicines with default parameters', async () => {
      const mockMedicines = {
        docs: [sampleMedicine],
        totalDocs: 1,
        totalPages: 1,
        page: 1
      };

      mockPaginate.mockResolvedValue(mockMedicines);

      const response = await request(app)
        .get('/medicines')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.medicines).toHaveLength(1);
      expect(response.body.count).toBe(1);
      expect(response.body.totalCount).toBe(1);
      expect(response.body.currentPage).toBe(1);
      expect(mockPaginate).toHaveBeenCalledWith(
        { status: 'active', stock: { $gt: 0 } },
        {
          page: 1,
          limit: 20,
          sort: '-createdAt',
          select: '-__v -createdBy -updatedBy'
        }
      );
    });

    test('should apply category filter', async () => {
      mockPaginate.mockResolvedValue({
        docs: [sampleMedicine],
        totalDocs: 1,
        totalPages: 1,
        page: 1
      });

      await request(app)
        .get('/medicines?category=OTC')
        .expect(200);

      expect(mockPaginate).toHaveBeenCalledWith(
        { status: 'active', category: 'OTC', stock: { $gt: 0 } },
        expect.any(Object)
      );
    });

    test('should apply brand filter', async () => {
      mockPaginate.mockResolvedValue({
        docs: [sampleMedicine],
        totalDocs: 1,
        totalPages: 1,
        page: 1
      });

      await request(app)
        .get('/medicines?brand=Crocin')
        .expect(200);

      expect(mockPaginate).toHaveBeenCalledWith(
        { status: 'active', brand: new RegExp('Crocin', 'i'), stock: { $gt: 0 } },
        expect.any(Object)
      );
    });

    test('should apply price range filter', async () => {
      mockPaginate.mockResolvedValue({
        docs: [sampleMedicine],
        totalDocs: 1,
        totalPages: 1,
        page: 1
      });

      await request(app)
        .get('/medicines?minPrice=20&maxPrice=100')
        .expect(200);

      expect(mockPaginate).toHaveBeenCalledWith(
        { 
          status: 'active', 
          sellingPrice: { $gte: 20, $lte: 100 },
          stock: { $gt: 0 }
        },
        expect.any(Object)
      );
    });

    test('should apply prescription filter', async () => {
      mockPaginate.mockResolvedValue({
        docs: [sampleMedicine],
        totalDocs: 1,
        totalPages: 1,
        page: 1
      });

      await request(app)
        .get('/medicines?requiresPrescription=true')
        .expect(200);

      expect(mockPaginate).toHaveBeenCalledWith(
        { 
          status: 'active', 
          requiresPrescription: true,
          stock: { $gt: 0 }
        },
        expect.any(Object)
      );
    });

    test('should handle pagination parameters', async () => {
      mockPaginate.mockResolvedValue({
        docs: [sampleMedicine],
        totalDocs: 50,
        totalPages: 5,
        page: 2
      });

      await request(app)
        .get('/medicines?page=2&limit=10')
        .expect(200);

      expect(mockPaginate).toHaveBeenCalledWith(
        expect.any(Object),
        {
          page: 2,
          limit: 10,
          sort: '-createdAt',
          select: '-__v -createdBy -updatedBy'
        }
      );
    });

    test('should allow showing out of stock medicines', async () => {
      mockPaginate.mockResolvedValue({
        docs: [sampleMedicine],
        totalDocs: 1,
        totalPages: 1,
        page: 1
      });

      await request(app)
        .get('/medicines?inStock=false')
        .expect(200);

      expect(mockPaginate).toHaveBeenCalledWith(
        { status: 'active' }, // Should not include stock filter
        expect.any(Object)
      );
    });

    test('should handle database errors', async () => {
      mockPaginate.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/medicines')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to fetch medicines');
    });
  });

  describe('GET /medicines/search', () => {
    test('should search medicines successfully', async () => {
      const mockFind = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue([sampleMedicine])
            })
          })
        })
      });

      Medicine.find = mockFind;
      Medicine.countDocuments = jest.fn().mockResolvedValue(1);

      const response = await request(app)
        .get('/medicines/search?q=paracetamol')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.medicines).toHaveLength(1);
      expect(response.body.searchTerm).toBe('paracetamol');
      expect(mockFind).toHaveBeenCalledWith(
        {
          $text: { $search: 'paracetamol' },
          status: 'active'
        },
        { score: { $meta: 'textScore' } }
      );
    });

    test('should require search query', async () => {
      const response = await request(app)
        .get('/medicines/search')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Search query is required');
    });

    test('should apply search filters', async () => {
      const mockFind = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue([sampleMedicine])
            })
          })
        })
      });

      Medicine.find = mockFind;
      Medicine.countDocuments = jest.fn().mockResolvedValue(1);

      await request(app)
        .get('/medicines/search?q=paracetamol&category=OTC&brand=Crocin&minPrice=20&maxPrice=100&requiresPrescription=false')
        .expect(200);

      expect(mockFind).toHaveBeenCalledWith(
        {
          $text: { $search: 'paracetamol' },
          status: 'active',
          category: 'OTC',
          brand: new RegExp('Crocin', 'i'),
          sellingPrice: { $gte: 20, $lte: 100 },
          requiresPrescription: false
        },
        { score: { $meta: 'textScore' } }
      );
    });

    test('should handle search errors', async () => {
      Medicine.find = jest.fn().mockImplementation(() => {
        throw new Error('Search error');
      });

      const response = await request(app)
        .get('/medicines/search?q=paracetamol')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Search failed');
    });
  });

  describe('GET /medicines/popular', () => {
    test('should get popular medicines', async () => {
      const mockFind = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue([sampleMedicine])
          })
        })
      });

      Medicine.find = mockFind;

      const response = await request(app)
        .get('/medicines/popular')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.medicines).toHaveLength(1);
      expect(mockFind).toHaveBeenCalledWith({
        isPopular: true,
        status: 'active',
        stock: { $gt: 0 }
      });
    });

    test('should filter popular medicines by category', async () => {
      const mockFind = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue([sampleMedicine])
          })
        })
      });

      Medicine.find = mockFind;

      await request(app)
        .get('/medicines/popular?category=OTC&limit=10')
        .expect(200);

      expect(mockFind).toHaveBeenCalledWith({
        isPopular: true,
        status: 'active',
        stock: { $gt: 0 },
        category: 'OTC'
      });
    });
  });

  describe('GET /medicines/recommendations', () => {
    test('should get personalized recommendations', async () => {
      const user = await new User({
        phoneNumber: '+1234567890',
        name: 'Test User'
      }).save();

      // Mock order history
      const mockFind = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([
              {
                items: [
                  { 
                    medicine: { 
                      category: 'OTC', 
                      brand: 'Crocin' 
                    } 
                  }
                ]
              }
            ])
          })
        })
      });

      Order.find = mockFind;

      const mockMedicineFind = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue([sampleMedicine])
          })
        })
      });

      Medicine.find = mockMedicineFind;

      const response = await request(app)
        .get('/medicines/recommendations')
        .set('user-id', user._id.toString())
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.recommendations).toBeDefined();
    });

    test('should fallback to popular medicines when no order history', async () => {
      const user = await new User({
        phoneNumber: '+1234567890',
        name: 'Test User'
      }).save();

      // Mock empty order history
      Order.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([])
          })
        })
      });

      // Mock first find for recommendations (empty)
      // Mock second find for popular medicines
      const mockMedicineFind = jest.fn()
        .mockReturnValueOnce({
          sort: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue([])
            })
          })
        })
        .mockReturnValueOnce({
          sort: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue([sampleMedicine])
            })
          })
        });

      Medicine.find = mockMedicineFind;

      const response = await request(app)
        .get('/medicines/recommendations')
        .set('user-id', user._id.toString())
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockMedicineFind).toHaveBeenCalledTimes(2);
    });
  });

  describe('GET /medicines/categories', () => {
    test('should get medicine categories', async () => {
      Medicine.distinct = jest.fn().mockResolvedValue(['OTC', 'Prescription', 'Ayurvedic']);
      Medicine.aggregate = jest.fn().mockResolvedValue([
        { _id: 'OTC', count: 50, avgRating: 4.2 },
        { _id: 'Prescription', count: 30, avgRating: 4.5 },
        { _id: 'Ayurvedic', count: 20, avgRating: 4.0 }
      ]);

      const response = await request(app)
        .get('/medicines/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.categories).toEqual(['OTC', 'Prescription', 'Ayurvedic']);
      expect(response.body.categoryStats).toHaveLength(3);
      expect(response.body.count).toBe(3);
    });

    test('should handle category fetch errors', async () => {
      Medicine.distinct = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/medicines/categories')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to get categories');
    });
  });

  describe('GET /medicines/brands', () => {
    test('should get medicine brands', async () => {
      Medicine.aggregate = jest.fn().mockResolvedValue([
        { _id: 'Crocin', count: 10, avgPrice: 45 },
        { _id: 'Dolo', count: 8, avgPrice: 40 },
        { _id: 'Panadol', count: 5, avgPrice: 50 }
      ]);

      const response = await request(app)
        .get('/medicines/brands')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.brands).toHaveLength(3);
      expect(response.body.count).toBe(3);
    });

    test('should filter brands by category', async () => {
      Medicine.aggregate = jest.fn().mockResolvedValue([
        { _id: 'Crocin', count: 5, avgPrice: 45 }
      ]);

      await request(app)
        .get('/medicines/brands?category=OTC')
        .expect(200);

      expect(Medicine.aggregate).toHaveBeenCalledWith([
        { $match: { status: 'active', category: 'OTC' } },
        {
          $group: {
            _id: '$brand',
            count: { $sum: 1 },
            avgPrice: { $avg: '$sellingPrice' }
          }
        },
        { $sort: { count: -1, _id: 1 } }
      ]);
    });
  });

  describe('GET /medicines/:id', () => {
    test('should get medicine by ID', async () => {
      const mockPopulate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({
            ...sampleMedicine,
            incrementView: jest.fn().mockResolvedValue(true),
            relatedMedicines: []
          })
        })
      });

      Medicine.findById = jest.fn().mockReturnValue({
        populate: mockPopulate
      });

      // Mock similar medicines query for when no related medicines
      Medicine.find = jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue([
            { name: 'Similar Medicine', brand: 'Test Brand' }
          ])
        })
      });

      const response = await request(app)
        .get('/medicines/64a7c9e5f123456789abcdef')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.medicine).toBeDefined();
      expect(Medicine.findById).toHaveBeenCalledWith('64a7c9e5f123456789abcdef');
    });

    test('should return 404 for non-existent medicine', async () => {
      Medicine.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue(null)
          })
        })
      });

      const response = await request(app)
        .get('/medicines/64a7c9e5f123456789abcdef')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Medicine not found');
    });

    test('should handle invalid medicine ID', async () => {
      Medicine.findById = jest.fn().mockImplementation(() => {
        throw new Error('Invalid ID');
      });

      const response = await request(app)
        .get('/medicines/invalid-id')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to get medicine');
    });
  });

  describe('Error Handling', () => {
    test('should handle database connection errors', async () => {
      mockPaginate.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/medicines')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to fetch medicines');
    });

    test('should include error details in development mode', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      mockPaginate.mockRejectedValue(new Error('Specific database error'));

      const response = await request(app)
        .get('/medicines')
        .expect(500);

      expect(response.body.error).toBe('Specific database error');
      
      process.env.NODE_ENV = originalEnv;
    });

    test('should hide error details in production mode', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      mockPaginate.mockRejectedValue(new Error('Specific database error'));

      const response = await request(app)
        .get('/medicines')
        .expect(500);

      expect(response.body.error).toBe('Internal server error');
      
      process.env.NODE_ENV = originalEnv;
    });
  });
});