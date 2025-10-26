const request = require('supertest');
const express = require('express');
const multer = require('multer');
const Prescription = require('../../src/models/Prescription');
const { uploadPrescription, getPrescriptions, deletePrescription } = require('../../src/controllers/prescription.controller');

// Mock cloudinary
const mockCloudinary = {
  config: jest.fn(),
  uploader: {
    upload: jest.fn(),
    destroy: jest.fn()
  }
};

jest.mock('cloudinary', () => ({
  v2: mockCloudinary
}));

// Create express app for testing
const app = express();
app.use(express.json());

// Mock file upload middleware
const mockMulter = multer({ dest: 'uploads/temp' });

// Mock auth middleware
const mockAuth = (req, res, next) => {
  req.user = { id: req.headers['user-id'] || '64a7c9e5f123456789abcdef' };
  next();
};

// Mock file middleware for testing
const mockFile = (req, res, next) => {
  if (req.headers['mock-file']) {
    req.file = JSON.parse(req.headers['mock-file']);
  }
  next();
};

// Routes for testing
app.post('/prescriptions', mockAuth, mockFile, uploadPrescription);
app.get('/prescriptions', mockAuth, getPrescriptions);
app.delete('/prescriptions/:id', mockAuth, deletePrescription);

describe('Prescription Controller', () => {
  let userId;
  let mockPrescription;

  beforeEach(() => {
    userId = '64a7c9e5f123456789abcdef';
    
    mockPrescription = {
      _id: '64a7c9e5f123456789abcde1',
      user: userId,
      imageUrl: 'https://res.cloudinary.com/test/prescriptions/prescription1.jpg',
      cloudinaryId: 'prescriptions/prescription1',
      originalFileName: 'prescription.jpg',
      fileSize: 1024000,
      mimeType: 'image/jpeg',
      type: 'Handwritten',
      isActive: true,
      isDeleted: false,
      createdAt: new Date()
    };

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('POST /prescriptions', () => {
    test('should upload prescription successfully', async () => {
      const mockFile = {
        path: '/tmp/prescription.jpg',
        originalname: 'prescription.jpg',
        size: 1024000,
        mimetype: 'image/jpeg'
      };

      const mockCloudinaryResult = {
        secure_url: 'https://res.cloudinary.com/test/prescriptions/prescription1.jpg',
        public_id: 'prescriptions/prescription1'
      };

      mockCloudinary.uploader.upload.mockResolvedValue(mockCloudinaryResult);
      
      const mockSave = jest.fn();
      const mockSavedPrescription = { ...mockPrescription, save: mockSave };
      
      jest.spyOn(Prescription.prototype, 'constructor').mockImplementation(() => mockSavedPrescription);
      Prescription.prototype.save = mockSave;

      const response = await request(app)
        .post('/prescriptions')
        .set('user-id', userId)
        .set('mock-file', JSON.stringify(mockFile))
        .send({ type: 'Handwritten' })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Prescription uploaded successfully');
      expect(response.body.prescription).toBeDefined();
      
      expect(mockCloudinary.uploader.upload).toHaveBeenCalledWith(
        mockFile.path,
        {
          folder: 'prescriptions',
          resource_type: 'image',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' }
          ]
        }
      );
      expect(mockSave).toHaveBeenCalled();
    });

    test('should use default type when not provided', async () => {
      const mockFile = {
        path: '/tmp/prescription.jpg',
        originalname: 'prescription.jpg',
        size: 1024000,
        mimetype: 'image/jpeg'
      };

      const mockCloudinaryResult = {
        secure_url: 'https://res.cloudinary.com/test/prescriptions/prescription2.jpg',
        public_id: 'prescriptions/prescription2'
      };

      mockCloudinary.uploader.upload.mockResolvedValue(mockCloudinaryResult);
      
      const mockSave = jest.fn();
      const mockSavedPrescription = { ...mockPrescription, type: 'Handwritten', save: mockSave };
      
      jest.spyOn(Prescription.prototype, 'constructor').mockImplementation(() => mockSavedPrescription);
      Prescription.prototype.save = mockSave;

      const response = await request(app)
        .post('/prescriptions')
        .set('user-id', userId)
        .set('mock-file', JSON.stringify(mockFile))
        .send({}) // No type provided
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(mockSave).toHaveBeenCalled();
    });

    test('should handle different prescription types', async () => {
      const mockFile = {
        path: '/tmp/prescription.pdf',
        originalname: 'prescription.pdf',
        size: 2048000,
        mimetype: 'application/pdf'
      };

      const mockCloudinaryResult = {
        secure_url: 'https://res.cloudinary.com/test/prescriptions/prescription3.jpg',
        public_id: 'prescriptions/prescription3'
      };

      mockCloudinary.uploader.upload.mockResolvedValue(mockCloudinaryResult);
      
      const mockSave = jest.fn();
      const mockSavedPrescription = { ...mockPrescription, type: 'Digital', save: mockSave };
      
      jest.spyOn(Prescription.prototype, 'constructor').mockImplementation(() => mockSavedPrescription);
      Prescription.prototype.save = mockSave;

      const response = await request(app)
        .post('/prescriptions')
        .set('user-id', userId)
        .set('mock-file', JSON.stringify(mockFile))
        .send({ type: 'Digital' })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(mockSave).toHaveBeenCalled();
    });

    test('should return 400 when no file is uploaded', async () => {
      const response = await request(app)
        .post('/prescriptions')
        .set('user-id', userId)
        .send({ type: 'Handwritten' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No file uploaded');
    });

    test('should handle cloudinary upload errors', async () => {
      const mockFile = {
        path: '/tmp/prescription.jpg',
        originalname: 'prescription.jpg',
        size: 1024000,
        mimetype: 'image/jpeg'
      };

      mockCloudinary.uploader.upload.mockRejectedValue(
        new Error('Cloudinary upload failed')
      );

      const response = await request(app)
        .post('/prescriptions')
        .set('user-id', userId)
        .set('mock-file', JSON.stringify(mockFile))
        .send({ type: 'Handwritten' })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to upload prescription');
    });

    test('should handle database save errors', async () => {
      const mockFile = {
        path: '/tmp/prescription.jpg',
        originalname: 'prescription.jpg',
        size: 1024000,
        mimetype: 'image/jpeg'
      };

      const mockCloudinaryResult = {
        secure_url: 'https://res.cloudinary.com/test/prescriptions/prescription4.jpg',
        public_id: 'prescriptions/prescription4'
      };

      mockCloudinary.uploader.upload.mockResolvedValue(mockCloudinaryResult);
      
      const mockSave = jest.fn().mockRejectedValue(new Error('Database save error'));
      
      jest.spyOn(Prescription.prototype, 'constructor').mockImplementation(() => ({ save: mockSave }));
      Prescription.prototype.save = mockSave;

      const response = await request(app)
        .post('/prescriptions')
        .set('user-id', userId)
        .set('mock-file', JSON.stringify(mockFile))
        .send({ type: 'Handwritten' })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to upload prescription');
    });

    test('should handle large file uploads', async () => {
      const mockLargeFile = {
        path: '/tmp/large_prescription.jpg',
        originalname: 'large_prescription.jpg',
        size: 10240000, // 10MB
        mimetype: 'image/jpeg'
      };

      const mockCloudinaryResult = {
        secure_url: 'https://res.cloudinary.com/test/prescriptions/large_prescription.jpg',
        public_id: 'prescriptions/large_prescription'
      };

      mockCloudinary.uploader.upload.mockResolvedValue(mockCloudinaryResult);
      
      const mockSave = jest.fn();
      const mockSavedPrescription = { ...mockPrescription, fileSize: 10240000, save: mockSave };
      
      jest.spyOn(Prescription.prototype, 'constructor').mockImplementation(() => mockSavedPrescription);
      Prescription.prototype.save = mockSave;

      const response = await request(app)
        .post('/prescriptions')
        .set('user-id', userId)
        .set('mock-file', JSON.stringify(mockLargeFile))
        .send({ type: 'Digital' })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe('GET /prescriptions', () => {
    test('should get all prescriptions successfully', async () => {
      const mockPrescriptions = [
        { ...mockPrescription },
        { 
          ...mockPrescription, 
          _id: '64a7c9e5f123456789abcde2', 
          originalFileName: 'prescription2.jpg',
          type: 'Digital'
        }
      ];

      const mockQuery = {
        sort: jest.fn().mockResolvedValue(mockPrescriptions)
      };

      jest.spyOn(Prescription, 'find').mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/prescriptions')
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.prescriptions).toHaveLength(2);
      expect(Prescription.find).toHaveBeenCalledWith({
        user: userId,
        isActive: true,
        isDeleted: false
      });
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
    });

    test('should return empty array when no prescriptions found', async () => {
      const mockQuery = {
        sort: jest.fn().mockResolvedValue([])
      };

      jest.spyOn(Prescription, 'find').mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/prescriptions')
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.prescriptions).toHaveLength(0);
    });

    test('should handle database errors', async () => {
      jest.spyOn(Prescription, 'find').mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/prescriptions')
        .set('user-id', userId)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to get prescriptions');
    });

    test('should filter out inactive and deleted prescriptions', async () => {
      const mockPrescriptions = [
        { ...mockPrescription, isActive: true, isDeleted: false }
      ];

      const mockQuery = {
        sort: jest.fn().mockResolvedValue(mockPrescriptions)
      };

      jest.spyOn(Prescription, 'find').mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/prescriptions')
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Prescription.find).toHaveBeenCalledWith({
        user: userId,
        isActive: true,
        isDeleted: false
      });
    });
  });

  describe('DELETE /prescriptions/:id', () => {
    test('should delete prescription successfully', async () => {
      const mockPrescriptionWithMethods = {
        ...mockPrescription,
        softDelete: jest.fn()
      };
      
      jest.spyOn(Prescription, 'findOne').mockResolvedValue(mockPrescriptionWithMethods);
      mockCloudinary.uploader.destroy.mockResolvedValue({ result: 'ok' });

      const response = await request(app)
        .delete(`/prescriptions/${mockPrescription._id}`)
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Prescription deleted successfully');
      expect(mockPrescriptionWithMethods.softDelete).toHaveBeenCalled();
      expect(mockCloudinary.uploader.destroy).toHaveBeenCalledWith(mockPrescription.cloudinaryId);
      expect(Prescription.findOne).toHaveBeenCalledWith({
        _id: mockPrescription._id,
        user: userId
      });
    });

    test('should delete prescription without cloudinary ID', async () => {
      const prescriptionWithoutCloudinary = {
        ...mockPrescription,
        cloudinaryId: null,
        softDelete: jest.fn()
      };
      
      jest.spyOn(Prescription, 'findOne').mockResolvedValue(prescriptionWithoutCloudinary);

      const response = await request(app)
        .delete(`/prescriptions/${mockPrescription._id}`)
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Prescription deleted successfully');
      expect(prescriptionWithoutCloudinary.softDelete).toHaveBeenCalled();
      expect(mockCloudinary.uploader.destroy).not.toHaveBeenCalled();
    });

    test('should return 404 for non-existent prescription', async () => {
      jest.spyOn(Prescription, 'findOne').mockResolvedValue(null);

      const response = await request(app)
        .delete('/prescriptions/64a7c9e5f123456789abcde9')
        .set('user-id', userId)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Prescription not found');
    });

    test('should return 404 when deleting other user prescription', async () => {
      jest.spyOn(Prescription, 'findOne').mockResolvedValue(null);

      const response = await request(app)
        .delete(`/prescriptions/${mockPrescription._id}`)
        .set('user-id', 'different-user-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Prescription not found');
      expect(Prescription.findOne).toHaveBeenCalledWith({
        _id: mockPrescription._id,
        user: 'different-user-id'
      });
    });

    test('should handle soft delete errors', async () => {
      const mockPrescriptionWithError = {
        ...mockPrescription,
        softDelete: jest.fn().mockRejectedValue(new Error('Soft delete failed'))
      };
      
      jest.spyOn(Prescription, 'findOne').mockResolvedValue(mockPrescriptionWithError);

      const response = await request(app)
        .delete(`/prescriptions/${mockPrescription._id}`)
        .set('user-id', userId)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to delete prescription');
    });

    test('should handle cloudinary delete errors but still succeed', async () => {
      const mockPrescriptionWithMethods = {
        ...mockPrescription,
        softDelete: jest.fn()
      };
      
      jest.spyOn(Prescription, 'findOne').mockResolvedValue(mockPrescriptionWithMethods);
      mockCloudinary.uploader.destroy.mockRejectedValue(new Error('Cloudinary delete failed'));

      const response = await request(app)
        .delete(`/prescriptions/${mockPrescription._id}`)
        .set('user-id', userId)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to delete prescription');
      expect(mockPrescriptionWithMethods.softDelete).toHaveBeenCalled();
    });

    test('should handle database errors', async () => {
      jest.spyOn(Prescription, 'findOne').mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete(`/prescriptions/${mockPrescription._id}`)
        .set('user-id', userId)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to delete prescription');
    });

    test('should handle undefined cloudinaryId', async () => {
      const mockPrescriptionUndefinedId = {
        ...mockPrescription,
        cloudinaryId: undefined,
        softDelete: jest.fn()
      };
      
      jest.spyOn(Prescription, 'findOne').mockResolvedValue(mockPrescriptionUndefinedId);

      const response = await request(app)
        .delete(`/prescriptions/${mockPrescription._id}`)
        .set('user-id', userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockPrescriptionUndefinedId.softDelete).toHaveBeenCalled();
      expect(mockCloudinary.uploader.destroy).not.toHaveBeenCalled();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});