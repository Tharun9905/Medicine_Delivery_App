const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const LabTest = require('../../src/models/labTest.model');
const labTestRoutes = require('../../src/routes/labTest.routes');

const app = express();
app.use(express.json());
app.use('/api/lab-tests', labTestRoutes);

describe('Lab Test Controller', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await LabTest.deleteMany({});
  });

  describe('Lab tests API returns data', () => {
    test('should get all lab tests', async () => {
      // Create test data
      await LabTest.create([
        {
          name: 'Complete Blood Count',
          code: 'CBC',
          description: 'Basic health screening test',
          category: 'blood-test',
          price: 299,
          sampleType: 'Blood',
          isHomeCollection: true,
          isFastingRequired: false,
          reportTime: '24 hours',
          preparations: ['No special preparation required']
        },
        {
          name: 'Liver Function Test',
          code: 'LFT',
          description: 'Check liver health',
          category: 'liver-function',
          price: 499,
          sampleType: 'Blood',
          isHomeCollection: true,
          isFastingRequired: true,
          reportTime: '24 hours',
          preparations: ['12 hours fasting required']
        }
      ]);

      const response = await request(app)
        .get('/api/lab-tests')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.labTests).toHaveLength(2);
      expect(response.body.labTests[0].name).toBe('Complete Blood Count');
    });

    test('should get lab test by ID', async () => {
      const labTest = await LabTest.create({
        name: 'Thyroid Panel',
        code: 'TPT',
        description: 'T3, T4, and TSH levels',
        category: 'thyroid-test',
        price: 399,
        sampleType: 'Blood',
        isHomeCollection: true,
        isFastingRequired: false,
        reportTime: '24 hours',
        preparations: ['No special preparation required']
      });

      const response = await request(app)
        .get(`/api/lab-tests/${labTest._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.labTest.name).toBe('Thyroid Panel');
      expect(response.body.labTest.code).toBe('TPT');
    });

    test('should search lab tests by name', async () => {
      await LabTest.create([
        {
          name: 'Diabetes Test',
          code: 'DT',
          description: 'Fasting glucose & HbA1c',
          category: 'diabetes-test',
          price: 349,
          sampleType: 'Blood',
          isHomeCollection: true,
          isFastingRequired: true,
          reportTime: '24 hours',
          preparations: ['12 hours fasting required']
        }
      ]);

      const response = await request(app)
        .get('/api/lab-tests/search?q=diabetes')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.labTests).toHaveLength(1);
      expect(response.body.labTests[0].name).toBe('Diabetes Test');
    });

    test('should filter lab tests by category', async () => {
      await LabTest.create([
        {
          name: 'Complete Blood Count',
          code: 'CBC',
          description: 'Basic health screening',
          category: 'blood-test',
          price: 299,
          sampleType: 'Blood',
          isHomeCollection: true,
          isFastingRequired: false,
          reportTime: '24 hours',
          preparations: []
        },
        {
          name: 'Liver Function Test',
          code: 'LFT',
          description: 'Liver health check',
          category: 'liver-function',
          price: 499,
          sampleType: 'Blood',
          isHomeCollection: true,
          isFastingRequired: true,
          reportTime: '24 hours',
          preparations: []
        }
      ]);

      const response = await request(app)
        .get('/api/lab-tests?category=blood-test')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.labTests).toHaveLength(1);
      expect(response.body.labTests[0].category).toBe('blood-test');
    });
  });

  describe('Lab test validation', () => {
    test('should return 404 for non-existent lab test', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/lab-tests/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Lab test not found');
    });

    test('should handle invalid search query', async () => {
      const response = await request(app)
        .get('/api/lab-tests/search')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Search query is required');
    });
  });

  describe('Lab test categories', () => {
    test('should get available categories', async () => {
      await LabTest.create([
        {
          name: 'Test 1',
          code: 'T1',
          description: 'Test description',
          category: 'blood-test',
          price: 100,
          sampleType: 'Blood',
          isHomeCollection: true,
          isFastingRequired: false,
          reportTime: '24 hours',
          preparations: []
        },
        {
          name: 'Test 2',
          code: 'T2',
          description: 'Test description',
          category: 'urine-test',
          price: 200,
          sampleType: 'Urine',
          isHomeCollection: true,
          isFastingRequired: false,
          reportTime: '24 hours',
          preparations: []
        }
      ]);

      const response = await request(app)
        .get('/api/lab-tests/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.categories).toContain('blood-test');
      expect(response.body.categories).toContain('urine-test');
    });
  });
});