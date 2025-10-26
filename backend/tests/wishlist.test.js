const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../src/models/user.model');
const Medicine = require('../src/models/medicine.model');
const Wishlist = require('../src/models/wishlist.model');

describe('Wishlist API', () => {
  let mongoServer;
  let userToken;
  let userId;
  let medicineId;

  beforeAll(async () => {
    // Start in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Disconnect from any existing connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear collections
    await User.deleteMany({});
    await Medicine.deleteMany({});
    await Wishlist.deleteMany({});

    // Create test user
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '+1234567890'
      });

    userToken = userResponse.body.token;
    userId = userResponse.body.user.id;

    // Create test medicine
    const medicine = new Medicine({
      name: 'Test Medicine',
      description: 'Test description',
      price: 99.99,
      category: 'General',
      manufacturer: 'Test Pharma',
      stock: 100,
      images: ['test-image.jpg'],
      prescription_required: false
    });
    await medicine.save();
    medicineId = medicine._id;
  });

  describe('POST /api/wishlist/add', () => {
    test('should add medicine to wishlist successfully', async () => {
      const response = await request(app)
        .post('/api/wishlist/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          medicineId: medicineId
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Medicine added to wishlist');
    });

    test('should not add duplicate medicine to wishlist', async () => {
      // Add medicine first time
      await request(app)
        .post('/api/wishlist/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          medicineId: medicineId
        });

      // Try to add same medicine again
      const response = await request(app)
        .post('/api/wishlist/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          medicineId: medicineId
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Medicine is already in your wishlist');
    });

    test('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/wishlist/add')
        .send({
          medicineId: medicineId
        });

      expect(response.status).toBe(401);
    });

    test('should return 404 for non-existent medicine', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .post('/api/wishlist/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          medicineId: fakeId
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Medicine not found');
    });
  });

  describe('GET /api/wishlist', () => {
    test('should get user wishlist successfully', async () => {
      // Add medicine to wishlist first
      await request(app)
        .post('/api/wishlist/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          medicineId: medicineId
        });

      const response = await request(app)
        .get('/api/wishlist')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.wishlist).toBeDefined();
      expect(response.body.wishlist.items).toHaveLength(1);
      expect(response.body.wishlist.items[0].medicine.name).toBe('Test Medicine');
    });

    test('should return empty wishlist for new user', async () => {
      const response = await request(app)
        .get('/api/wishlist')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.wishlist.items).toHaveLength(0);
    });

    test('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/wishlist');

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/wishlist/remove/:medicineId', () => {
    test('should remove medicine from wishlist successfully', async () => {
      // Add medicine to wishlist first
      await request(app)
        .post('/api/wishlist/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          medicineId: medicineId
        });

      const response = await request(app)
        .delete(`/api/wishlist/remove/${medicineId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Medicine removed from wishlist');
    });

    test('should return 404 when removing non-existent medicine', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/wishlist/remove/${fakeId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Medicine not found in wishlist');
    });
  });

  describe('POST /api/wishlist/move-to-cart/:medicineId', () => {
    test('should move medicine from wishlist to cart', async () => {
      // Add medicine to wishlist first
      await request(app)
        .post('/api/wishlist/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          medicineId: medicineId
        });

      const response = await request(app)
        .post(`/api/wishlist/move-to-cart/${medicineId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          quantity: 2
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Medicine moved to cart');
    });
  });

  describe('DELETE /api/wishlist/clear', () => {
    test('should clear entire wishlist', async () => {
      // Add medicine to wishlist first
      await request(app)
        .post('/api/wishlist/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          medicineId: medicineId
        });

      const response = await request(app)
        .delete('/api/wishlist/clear')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Wishlist cleared successfully');
    });
  });

  describe('GET /api/wishlist/count', () => {
    test('should get wishlist item count', async () => {
      // Add medicine to wishlist first
      await request(app)
        .post('/api/wishlist/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          medicineId: medicineId
        });

      const response = await request(app)
        .get('/api/wishlist/count')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
    });
  });
});