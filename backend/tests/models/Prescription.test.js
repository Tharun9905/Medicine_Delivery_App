const Prescription = require('../../src/models/Prescription');
const User = require('../../src/models/User');
const Medicine = require('../../src/models/Medicine');

describe('Prescription Model', () => {
  let testUser;
  let testMedicine;

  beforeEach(async () => {
    // Create test user
    testUser = await new User({
      phoneNumber: '+1234567890',
      name: 'Test User',
      email: 'test@example.com'
    }).save();

    // Create test medicine
    testMedicine = await new Medicine({
      name: 'Paracetamol',
      brand: 'Crocin',
      manufacturer: 'GSK',
      category: 'OTC',
      dosageForm: 'Tablet',
      strength: '500mg',
      packSize: '10 tablets',
      mrp: 50,
      sellingPrice: 45,
      sku: 'MED001',
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    }).save();
  });

  const validPrescriptionData = {
    imageUrl: 'https://example.com/prescription.jpg',
    originalFileName: 'prescription.jpg',
    fileSize: 1024000,
    mimeType: 'image/jpeg',
    doctorInfo: {
      name: 'Dr. John Smith',
      qualification: 'MBBS, MD',
      registrationNumber: 'MH12345',
      hospital: 'City Hospital',
      specialization: 'General Medicine'
    },
    patientInfo: {
      name: 'Test Patient',
      age: 30,
      gender: 'Male',
      weight: '70kg'
    },
    prescriptionDate: new Date(),
    extractedMedicines: [{
      name: 'Paracetamol',
      dosage: '500mg',
      strength: '500mg',
      frequency: 'Twice daily',
      duration: '5 days',
      instructions: 'After meals',
      quantity: '10 tablets'
    }]
  };

  describe('Prescription Schema Validation', () => {
    test('should create prescription with valid data', async () => {
      const prescriptionData = {
        ...validPrescriptionData,
        user: testUser._id
      };

      const prescription = new Prescription(prescriptionData);
      const savedPrescription = await prescription.save();

      expect(savedPrescription.user.toString()).toBe(testUser._id.toString());
      expect(savedPrescription.imageUrl).toBe(prescriptionData.imageUrl);
      expect(savedPrescription.type).toBe('Handwritten'); // default value
      expect(savedPrescription.verificationStatus).toBe('Pending'); // default value
      expect(savedPrescription.isActive).toBe(true); // default value
      expect(savedPrescription.isDeleted).toBe(false); // default value
      expect(savedPrescription.usageCount).toBe(0); // default value
      expect(savedPrescription.uploadSource).toBe('web'); // default value
      expect(savedPrescription.expiresAt).toBeInstanceOf(Date);
    });

    test('should require user reference', async () => {
      const prescription = new Prescription(validPrescriptionData);
      await expect(prescription.save()).rejects.toThrow('User reference is required');
    });

    test('should require image URL', async () => {
      const prescriptionData = { ...validPrescriptionData, user: testUser._id };
      delete prescriptionData.imageUrl;

      const prescription = new Prescription(prescriptionData);
      await expect(prescription.save()).rejects.toThrow('Image URL is required');
    });

    test('should validate type enum', async () => {
      const prescriptionData = {
        ...validPrescriptionData,
        user: testUser._id,
        type: 'InvalidType'
      };

      const prescription = new Prescription(prescriptionData);
      await expect(prescription.save()).rejects.toThrow();
    });

    test('should validate verification status enum', async () => {
      const prescriptionData = {
        ...validPrescriptionData,
        user: testUser._id,
        verificationStatus: 'InvalidStatus'
      };

      const prescription = new Prescription(prescriptionData);
      await expect(prescription.save()).rejects.toThrow();
    });

    test('should validate patient gender enum', async () => {
      const prescriptionData = {
        ...validPrescriptionData,
        user: testUser._id,
        patientInfo: {
          ...validPrescriptionData.patientInfo,
          gender: 'InvalidGender'
        }
      };

      const prescription = new Prescription(prescriptionData);
      await expect(prescription.save()).rejects.toThrow();
    });

    test('should validate image quality enum values', async () => {
      const prescriptionData = {
        ...validPrescriptionData,
        user: testUser._id,
        imageQuality: {
          clarity: 'InvalidClarity',
          readability: 'Good',
          completeness: 'Complete'
        }
      };

      const prescription = new Prescription(prescriptionData);
      await expect(prescription.save()).rejects.toThrow();
    });

    test('should validate customer feedback rating range', async () => {
      const prescriptionData = {
        ...validPrescriptionData,
        user: testUser._id,
        customerFeedback: {
          rating: 6, // Invalid: exceeds max of 5
          comment: 'Great service'
        }
      };

      const prescription = new Prescription(prescriptionData);
      await expect(prescription.save()).rejects.toThrow();
    });

    test('should validate upload source enum', async () => {
      const prescriptionData = {
        ...validPrescriptionData,
        user: testUser._id,
        uploadSource: 'InvalidSource'
      };

      const prescription = new Prescription(prescriptionData);
      await expect(prescription.save()).rejects.toThrow();
    });

    test('should require extracted medicine name', async () => {
      const prescriptionData = {
        ...validPrescriptionData,
        user: testUser._id,
        extractedMedicines: [{
          dosage: '500mg',
          frequency: 'Twice daily'
          // Missing required name field
        }]
      };

      const prescription = new Prescription(prescriptionData);
      await expect(prescription.save()).rejects.toThrow();
    });
  });

  describe('Virtual Properties', () => {
    test('should check if prescription is expired', async () => {
      const expiredPrescription = new Prescription({
        ...validPrescriptionData,
        user: testUser._id,
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      });

      const validPrescription = new Prescription({
        ...validPrescriptionData,
        user: testUser._id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
      });

      expect(expiredPrescription.isExpired).toBe(true);
      expect(validPrescription.isExpired).toBe(false);
    });

    test('should check if prescription is valid', async () => {
      const validPrescription = new Prescription({
        ...validPrescriptionData,
        user: testUser._id,
        isActive: true,
        isDeleted: false,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });

      const invalidPrescription = new Prescription({
        ...validPrescriptionData,
        user: testUser._id,
        isActive: false,
        isDeleted: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });

      expect(validPrescription.isValid).toBe(true);
      expect(invalidPrescription.isValid).toBe(false);
    });

    test('should provide verification status display', async () => {
      const prescription = new Prescription({
        ...validPrescriptionData,
        user: testUser._id,
        verificationStatus: 'Pending'
      });

      expect(prescription.verificationStatusDisplay).toBe('Waiting for verification');

      prescription.verificationStatus = 'Verified';
      expect(prescription.verificationStatusDisplay).toBe('Verified and approved');

      prescription.verificationStatus = 'Rejected';
      expect(prescription.verificationStatusDisplay).toBe('Could not be verified');
    });

    test('should calculate days until expiry', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10); // 10 days from now

      const prescription = new Prescription({
        ...validPrescriptionData,
        user: testUser._id,
        expiresAt: futureDate
      });

      expect(prescription.daysUntilExpiry).toBe(10);
    });

    test('should return null days until expiry when no expiry date', async () => {
      const prescription = new Prescription({
        ...validPrescriptionData,
        user: testUser._id,
        expiresAt: undefined
      });

      expect(prescription.daysUntilExpiry).toBeNull();
    });
  });

  describe('Instance Methods', () => {
    let prescription;

    beforeEach(async () => {
      prescription = await new Prescription({
        ...validPrescriptionData,
        user: testUser._id
      }).save();
    });

    test('should verify prescription', async () => {
      const adminId = testUser._id; // Using testUser as admin for simplicity
      const notes = 'Prescription verified successfully';

      await prescription.verify(adminId, notes);

      expect(prescription.verificationStatus).toBe('Verified');
      expect(prescription.verifiedBy.toString()).toBe(adminId.toString());
      expect(prescription.verifiedAt).toBeInstanceOf(Date);
      expect(prescription.verificationNotes).toBe(notes);
      expect(prescription.isProcessed).toBe(true);
      expect(prescription.processedAt).toBeInstanceOf(Date);
    });

    test('should reject prescription', async () => {
      const adminId = testUser._id;
      const reason = 'Image quality is poor, unable to read clearly';

      await prescription.reject(adminId, reason);

      expect(prescription.verificationStatus).toBe('Rejected');
      expect(prescription.verifiedBy.toString()).toBe(adminId.toString());
      expect(prescription.verifiedAt).toBeInstanceOf(Date);
      expect(prescription.verificationNotes).toBe(reason);
      expect(prescription.isProcessed).toBe(true);
      expect(prescription.processedAt).toBeInstanceOf(Date);
    });

    test('should request clarification', async () => {
      const adminId = testUser._id;
      const message = 'Please provide a clearer image of the prescription';

      await prescription.requestClarification(adminId, message);

      expect(prescription.verificationStatus).toBe('Requires Clarification');
      expect(prescription.verifiedBy.toString()).toBe(adminId.toString());
      expect(prescription.verifiedAt).toBeInstanceOf(Date);
      expect(prescription.verificationNotes).toBe(message);
    });

    test('should increment usage count', async () => {
      const initialUsage = prescription.usageCount;
      const originalLastUsed = prescription.lastUsed;

      // Wait a moment to ensure time difference
      await new Promise(resolve => setTimeout(resolve, 10));
      
      await prescription.incrementUsage();

      expect(prescription.usageCount).toBe(initialUsage + 1);
      expect(prescription.lastUsed).toBeInstanceOf(Date);
      if (originalLastUsed) {
        expect(prescription.lastUsed.getTime()).toBeGreaterThan(originalLastUsed.getTime());
      }
    });

    test('should associate with order', async () => {
      const orderId = new (require('mongoose')).Types.ObjectId();
      const initialUsage = prescription.usageCount;

      await prescription.associateWithOrder(orderId);

      expect(prescription.orders).toContain(orderId);
      expect(prescription.usageCount).toBe(initialUsage + 1);
    });

    test('should not duplicate order association', async () => {
      const orderId = new (require('mongoose')).Types.ObjectId();

      await prescription.associateWithOrder(orderId);
      const firstUsageCount = prescription.usageCount;
      
      await prescription.associateWithOrder(orderId); // Same order again

      expect(prescription.orders).toContain(orderId);
      expect(prescription.orders.filter(id => id.toString() === orderId.toString())).toHaveLength(1);
      expect(prescription.usageCount).toBe(firstUsageCount); // Should not increment again
    });

    test('should update image quality', async () => {
      const clarity = 'Good';
      const readability = 'Excellent';
      const completeness = 'Complete';

      await prescription.updateImageQuality(clarity, readability, completeness);

      expect(prescription.imageQuality.clarity).toBe(clarity);
      expect(prescription.imageQuality.readability).toBe(readability);
      expect(prescription.imageQuality.completeness).toBe(completeness);
    });

    test('should add customer feedback', async () => {
      const rating = 5;
      const comment = 'Excellent service, prescription verified quickly';

      await prescription.addCustomerFeedback(rating, comment);

      expect(prescription.customerFeedback.rating).toBe(rating);
      expect(prescription.customerFeedback.comment).toBe(comment);
      expect(prescription.customerFeedback.submittedAt).toBeInstanceOf(Date);
    });

    test('should soft delete prescription', async () => {
      await prescription.softDelete();

      expect(prescription.isDeleted).toBe(true);
      expect(prescription.isActive).toBe(false);
    });
  });

  describe('Static Methods', () => {
    let pendingPrescription;
    let verifiedPrescription;
    let rejectedPrescription;

    beforeEach(async () => {
      pendingPrescription = await new Prescription({
        ...validPrescriptionData,
        user: testUser._id,
        verificationStatus: 'Pending'
      }).save();

      verifiedPrescription = await new Prescription({
        ...validPrescriptionData,
        user: testUser._id,
        verificationStatus: 'Verified',
        imageUrl: 'https://example.com/verified-prescription.jpg'
      }).save();

      rejectedPrescription = await new Prescription({
        ...validPrescriptionData,
        user: testUser._id,
        verificationStatus: 'Rejected',
        imageUrl: 'https://example.com/rejected-prescription.jpg'
      }).save();
    });

    test('should find pending prescriptions', async () => {
      const pendingPrescriptions = await Prescription.findPending();

      expect(pendingPrescriptions).toHaveLength(1);
      expect(pendingPrescriptions[0]._id.toString()).toBe(pendingPrescription._id.toString());
    });

    test('should find prescriptions by user', async () => {
      const userPrescriptions = await Prescription.findByUser(testUser._id);

      expect(userPrescriptions).toHaveLength(3);
      // Should be sorted by creation date descending
      expect(userPrescriptions[0]._id.toString()).toBe(rejectedPrescription._id.toString()); // Most recent
    });

    test('should find valid prescriptions for user', async () => {
      const validPrescriptions = await Prescription.findValid(testUser._id);

      expect(validPrescriptions).toHaveLength(1);
      expect(validPrescriptions[0]._id.toString()).toBe(verifiedPrescription._id.toString());
    });

    test('should find prescriptions expiring soon', async () => {
      // Create prescription expiring in 15 days
      const soonExpiringDate = new Date();
      soonExpiringDate.setDate(soonExpiringDate.getDate() + 15);

      const expiringSoonPrescription = await new Prescription({
        ...validPrescriptionData,
        user: testUser._id,
        verificationStatus: 'Verified',
        expiresAt: soonExpiringDate,
        imageUrl: 'https://example.com/expiring-prescription.jpg'
      }).save();

      const expiringSoon = await Prescription.findExpiringSoon(30);

      expect(expiringSoon.some(p => p._id.toString() === expiringSoonPrescription._id.toString())).toBe(true);
    });

    test('should not include already expired prescriptions in expiring soon', async () => {
      // Create already expired prescription
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);

      await new Prescription({
        ...validPrescriptionData,
        user: testUser._id,
        verificationStatus: 'Verified',
        expiresAt: pastDate,
        imageUrl: 'https://example.com/expired-prescription.jpg'
      }).save();

      const expiringSoon = await Prescription.findExpiringSoon(30);
      
      // Should not include expired prescriptions
      expect(expiringSoon.every(p => p.expiresAt > new Date())).toBe(true);
    });

    test('should get verification statistics', async () => {
      const stats = await Prescription.getVerificationStats();

      expect(stats).toHaveLength(3); // Pending, Verified, Rejected
      
      const pendingStats = stats.find(s => s._id === 'Pending');
      const verifiedStats = stats.find(s => s._id === 'Verified');
      const rejectedStats = stats.find(s => s._id === 'Rejected');

      expect(pendingStats.count).toBe(1);
      expect(verifiedStats.count).toBeGreaterThanOrEqual(1);
      expect(rejectedStats.count).toBe(1);
    });

    test('should exclude deleted prescriptions from stats', async () => {
      await pendingPrescription.softDelete();

      const stats = await Prescription.getVerificationStats();
      const pendingStats = stats.find(s => s._id === 'Pending');

      expect(pendingStats).toBeUndefined(); // No pending prescriptions after soft delete
    });
  });

  describe('Pre-save Middleware', () => {
    test('should set valid until date if not provided', async () => {
      const prescriptionDate = new Date();
      prescriptionDate.setMonth(prescriptionDate.getMonth() - 1); // 1 month ago

      const prescription = new Prescription({
        ...validPrescriptionData,
        user: testUser._id,
        prescriptionDate: prescriptionDate
        // validUntil not provided
      });

      await prescription.save();

      expect(prescription.validUntil).toBeInstanceOf(Date);
      
      const expectedValidUntil = new Date(prescriptionDate);
      expectedValidUntil.setMonth(expectedValidUntil.getMonth() + 6);
      
      expect(prescription.validUntil.getTime()).toBeCloseTo(expectedValidUntil.getTime(), -1);
    });

    test('should not override existing valid until date', async () => {
      const prescriptionDate = new Date();
      const customValidUntil = new Date();
      customValidUntil.setMonth(customValidUntil.getMonth() + 12); // 1 year

      const prescription = new Prescription({
        ...validPrescriptionData,
        user: testUser._id,
        prescriptionDate: prescriptionDate,
        validUntil: customValidUntil
      });

      await prescription.save();

      expect(prescription.validUntil.getTime()).toBe(customValidUntil.getTime());
    });

    test('should set data retention date', async () => {
      const prescription = new Prescription({
        ...validPrescriptionData,
        user: testUser._id
      });

      await prescription.save();

      expect(prescription.dataRetentionDate).toBeInstanceOf(Date);
      
      const expectedRetentionDate = new Date();
      expectedRetentionDate.setFullYear(expectedRetentionDate.getFullYear() + 7);
      
      // Should be approximately 7 years from now (within 1 day tolerance)
      const daysDiff = Math.abs(prescription.dataRetentionDate - expectedRetentionDate) / (1000 * 60 * 60 * 24);
      expect(daysDiff).toBeLessThan(1);
    });

    test('should not override existing data retention date', async () => {
      const customRetentionDate = new Date();
      customRetentionDate.setFullYear(customRetentionDate.getFullYear() + 10);

      const prescription = new Prescription({
        ...validPrescriptionData,
        user: testUser._id,
        dataRetentionDate: customRetentionDate
      });

      await prescription.save();

      expect(prescription.dataRetentionDate.getTime()).toBe(customRetentionDate.getTime());
    });
  });

  describe('Default Values', () => {
    test('should set default values correctly', () => {
      const prescription = new Prescription({
        ...validPrescriptionData,
        user: testUser._id
      });

      expect(prescription.type).toBe('Handwritten');
      expect(prescription.verificationStatus).toBe('Pending');
      expect(prescription.isProcessed).toBe(false);
      expect(prescription.usageCount).toBe(0);
      expect(prescription.isActive).toBe(true);
      expect(prescription.isDeleted).toBe(false);
      expect(prescription.consentGiven).toBe(true);
      expect(prescription.uploadSource).toBe('web');
      expect(prescription.expiresAt).toBeInstanceOf(Date);
      expect(prescription.extractedMedicines[0].matched).toBe(false);
    });
  });

  describe('Complex Scenarios', () => {
    test('should handle prescription with multiple medicines and alternatives', async () => {
      const medicine2 = await new Medicine({
        name: 'Aspirin',
        brand: 'Disprin',
        manufacturer: 'Reckitt',
        category: 'OTC',
        dosageForm: 'Tablet',
        strength: '325mg',
        packSize: '20 tablets',
        mrp: 100,
        sellingPrice: 90,
        sku: 'MED002',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }).save();

      const complexPrescription = await new Prescription({
        ...validPrescriptionData,
        user: testUser._id,
        extractedMedicines: [
          {
            name: 'Paracetamol',
            dosage: '500mg',
            matched: true,
            matchedMedicine: testMedicine._id,
            alternatives: [medicine2._id]
          },
          {
            name: 'Cough Syrup',
            dosage: '5ml',
            matched: false
          }
        ]
      }).save();

      expect(complexPrescription.extractedMedicines).toHaveLength(2);
      expect(complexPrescription.extractedMedicines[0].matched).toBe(true);
      expect(complexPrescription.extractedMedicines[0].matchedMedicine.toString()).toBe(testMedicine._id.toString());
      expect(complexPrescription.extractedMedicines[0].alternatives).toContain(medicine2._id);
      expect(complexPrescription.extractedMedicines[1].matched).toBe(false);
    });

    test('should handle prescription workflow from upload to completion', async () => {
      // 1. Create prescription
      const prescription = await new Prescription({
        ...validPrescriptionData,
        user: testUser._id,
        verificationStatus: 'Pending'
      }).save();

      expect(prescription.verificationStatus).toBe('Pending');
      expect(prescription.isProcessed).toBe(false);

      // 2. Update image quality
      await prescription.updateImageQuality('Good', 'Excellent', 'Complete');
      expect(prescription.imageQuality.clarity).toBe('Good');

      // 3. Verify prescription
      await prescription.verify(testUser._id, 'All medicines are available');
      expect(prescription.verificationStatus).toBe('Verified');
      expect(prescription.isProcessed).toBe(true);

      // 4. Associate with order
      const orderId = new (require('mongoose')).Types.ObjectId();
      await prescription.associateWithOrder(orderId);
      expect(prescription.orders).toContain(orderId);
      expect(prescription.usageCount).toBe(1);

      // 5. Add customer feedback
      await prescription.addCustomerFeedback(5, 'Quick and accurate verification');
      expect(prescription.customerFeedback.rating).toBe(5);
    });
  });

  describe('JSON Serialization', () => {
    test('should include virtuals in JSON output', async () => {
      const prescription = new Prescription({
        ...validPrescriptionData,
        user: testUser._id,
        expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
        verificationStatus: 'Verified'
      });

      const json = prescription.toJSON();
      expect(json.isExpired).toBeDefined();
      expect(json.isValid).toBeDefined();
      expect(json.verificationStatusDisplay).toBeDefined();
      expect(json.daysUntilExpiry).toBeDefined();
    });
  });
});