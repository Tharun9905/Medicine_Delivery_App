const Medicine = require('../../src/models/Medicine');

describe('Medicine Model', () => {
  const validMedicineData = {
    name: 'Paracetamol 500mg',
    category: 'OTC',
    packSize: '10 tablets',
    manufacturer: 'GSK',
    description: 'Pain relief and fever reducer',
    mrp: 50,
    price: 45,
    stock: 100,
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
  };

  beforeEach(async () => {
    // Clean up before each test
    await Medicine.deleteMany({});
  });

  describe('Schema Validation - Required Fields', () => {
    test('should create medicine with valid data', async () => {
      const medicine = new Medicine(validMedicineData);
      const savedMedicine = await medicine.save();

      expect(savedMedicine.name).toBe(validMedicineData.name);
      expect(savedMedicine.category).toBe(validMedicineData.category);
      expect(savedMedicine.packSize).toBe(validMedicineData.packSize);
      expect(savedMedicine.manufacturer).toBe(validMedicineData.manufacturer);
      expect(savedMedicine.mrp).toBe(validMedicineData.mrp);
      expect(savedMedicine.price).toBe(validMedicineData.price);
      expect(savedMedicine.expiryDate).toEqual(validMedicineData.expiryDate);
      expect(savedMedicine.isActive).toBe(true); // default value
      expect(savedMedicine.stock).toBe(100);
    });

    test('should require medicine name', async () => {
      const medicineData = { ...validMedicineData };
      delete medicineData.name;

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow('Medicine name is required');
    });

    test('should require category', async () => {
      const medicineData = { ...validMedicineData };
      delete medicineData.category;

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow('Category is required');
    });

    test('should require pack size', async () => {
      const medicineData = { ...validMedicineData };
      delete medicineData.packSize;

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow('Pack size is required');
    });

    test('should require MRP', async () => {
      const medicineData = { ...validMedicineData };
      delete medicineData.mrp;

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow('MRP is required');
    });

    test('should require price', async () => {
      const medicineData = { ...validMedicineData };
      delete medicineData.price;

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow('Price is required');
    });

    test('should require expiry date', async () => {
      const medicineData = { ...validMedicineData };
      delete medicineData.expiryDate;

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow('Expiry date is required');
    });
  });

  describe('Schema Validation - Field Constraints', () => {
    test('should not allow negative MRP', async () => {
      const medicineData = { ...validMedicineData, mrp: -10 };

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow();
    });

    test('should not allow negative price', async () => {
      const medicineData = { ...validMedicineData, price: -5 };

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow();
    });

    test('should not allow negative stock', async () => {
      const medicineData = { ...validMedicineData, stock: -1 };

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow();
    });

    test('should not allow discount above 100', async () => {
      const medicineData = { ...validMedicineData, discount: 150 };

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow();
    });

    test('should not allow negative discount', async () => {
      const medicineData = { ...validMedicineData, discount: -5 };

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow();
    });

    test('should not allow negative GST', async () => {
      const medicineData = { ...validMedicineData, gst: -5 };

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow();
    });

    test('should trim whitespace from string fields', async () => {
      const medicineData = {
        ...validMedicineData,
        name: '  Paracetamol 500mg  ',
        category: '  OTC  ',
        packSize: '  10 tablets  ',
        manufacturer: '  GSK  '
      };

      const medicine = new Medicine(medicineData);
      const savedMedicine = await medicine.save();

      expect(savedMedicine.name).toBe('Paracetamol 500mg');
      expect(savedMedicine.category).toBe('OTC');
      expect(savedMedicine.packSize).toBe('10 tablets');
      expect(savedMedicine.manufacturer).toBe('GSK');
    });

    test('should enforce maxlength for name', async () => {
      const longName = 'A'.repeat(201);
      const medicineData = { ...validMedicineData, name: longName };

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow();
    });

    test('should enforce maxlength for description', async () => {
      const longDescription = 'A'.repeat(1001);
      const medicineData = { ...validMedicineData, description: longDescription };

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow();
    });
  });

  describe('Default Values', () => {
    test('should set correct default values', async () => {
      const medicine = new Medicine({
        name: 'Test Medicine',
        category: 'OTC',
        packSize: '10 tablets',
        mrp: 100,
        price: 90,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      });

      await medicine.save();

      expect(medicine.discount).toBe(0);
      expect(medicine.gst).toBe(12);
      expect(medicine.stock).toBe(0);
      expect(medicine.isActive).toBe(true);
      expect(medicine.isFeatured).toBe(false);
      expect(medicine.isPrescriptionRequired).toBe(false);
      expect(medicine.soldCount).toBe(0);
    });
  });

  describe('Virtual Properties', () => {
    test('should calculate discount percentage correctly', async () => {
      const medicine = new Medicine({
        ...validMedicineData,
        mrp: 100,
        price: 80
      });

      expect(medicine.discountPercent).toBe(20);
    });

    test('should return 0 discount when price equals MRP', async () => {
      const medicine = new Medicine({
        ...validMedicineData,
        mrp: 100,
        price: 100
      });

      expect(medicine.discountPercent).toBe(0);
    });

    test('should return 0 discount when price is higher than MRP', async () => {
      const medicine = new Medicine({
        ...validMedicineData,
        mrp: 80,
        price: 100
      });

      expect(medicine.discountPercent).toBe(0);
    });

    test('should return 0 discount when MRP or price is missing', async () => {
      const medicineWithoutMrp = new Medicine({
        name: 'Test Medicine',
        category: 'Test',
        packSize: '10 tablets',
        price: 80,
        expiryDate: new Date('2025-12-31')
        // mrp not provided
      });

      const medicineWithoutPrice = new Medicine({
        name: 'Test Medicine',
        category: 'Test', 
        packSize: '10 tablets',
        mrp: 100,
        price: 0,  // price is required, so set to 0
        expiryDate: new Date('2025-12-31')
      });

      expect(medicineWithoutMrp.discountPercent).toBe(0);
      expect(medicineWithoutPrice.discountPercent).toBe(0);
    });

    test('should determine stock status correctly', async () => {
      const outOfStockMedicine = new Medicine({
        ...validMedicineData,
        stock: 0
      });

      const lowStockMedicine = new Medicine({
        ...validMedicineData,
        stock: 5
      });

      const inStockMedicine = new Medicine({
        ...validMedicineData,
        stock: 50
      });

      expect(outOfStockMedicine.stockStatus).toBe('out-of-stock');
      expect(lowStockMedicine.stockStatus).toBe('low-stock');
      expect(inStockMedicine.stockStatus).toBe('in-stock');
    });
  });

  describe('Instance Methods', () => {
    test('should update stock correctly - decrease operation', async () => {
      const medicine = await new Medicine({
        ...validMedicineData,
        stock: 50
      }).save();

      await medicine.updateStock(10, 'decrease');
      expect(medicine.stock).toBe(40);
    });

    test('should update stock correctly - increase operation', async () => {
      const medicine = await new Medicine({
        ...validMedicineData,
        stock: 50
      }).save();

      await medicine.updateStock(10, 'increase');
      expect(medicine.stock).toBe(60);
    });

    test('should default to decrease operation when not specified', async () => {
      const medicine = await new Medicine({
        ...validMedicineData,
        stock: 50
      }).save();

      await medicine.updateStock(10);
      expect(medicine.stock).toBe(40);
    });

    test('should throw error when decreasing stock below zero', async () => {
      const medicine = await new Medicine({
        ...validMedicineData,
        stock: 5
      }).save();

      expect(() => medicine.updateStock(10, 'decrease'))
        .toThrow('Insufficient stock');
    });

    test('should save changes after stock update', async () => {
      const medicine = await new Medicine({
        ...validMedicineData,
        stock: 50
      }).save();

      const originalId = medicine._id;
      await medicine.updateStock(10, 'decrease');

      const updatedMedicine = await Medicine.findById(originalId);
      expect(updatedMedicine.stock).toBe(40);
    });
  });

  describe('Pre-save Middleware', () => {
    test('should sync price and sellingPrice - price to sellingPrice', async () => {
      const medicine = new Medicine({
        ...validMedicineData,
        price: 90
        // sellingPrice not provided
      });

      await medicine.save();
      expect(medicine.sellingPrice).toBe(90);
    });

    test('should sync price and sellingPrice when middleware can access both', async () => {
      // Test the middleware behavior by checking that it preserves both values when both exist
      const medicine = new Medicine({
        name: 'Test Medicine',
        category: 'Test',
        packSize: '10 tablets',
        mrp: 100,
        price: 80,
        sellingPrice: 85,
        expiryDate: new Date('2025-12-31')
      });

      await medicine.save();
      // Both values should remain unchanged when both are provided
      expect(medicine.price).toBe(80);
      expect(medicine.sellingPrice).toBe(85);
    });

    test('should not override existing values when both are provided', async () => {
      const medicine = new Medicine({
        ...validMedicineData,
        price: 90,
        sellingPrice: 85
      });

      await medicine.save();
      expect(medicine.price).toBe(90);
      expect(medicine.sellingPrice).toBe(85);
    });
  });

  describe('Images Array', () => {
    test('should accept images array', async () => {
      const medicine = new Medicine({
        ...validMedicineData,
        images: [
          { url: 'image1.jpg', alt: 'Front view', isPrimary: false },
          { url: 'image2.jpg', alt: 'Back view', isPrimary: true },
          { url: 'image3.jpg', alt: 'Side view', isPrimary: false }
        ]
      });

      const savedMedicine = await medicine.save();
      expect(savedMedicine.images).toHaveLength(3);
      expect(savedMedicine.images[1].isPrimary).toBe(true);
      expect(savedMedicine.images[1].alt).toBe('Back view');
    });

    test('should work without images', async () => {
      const medicine = new Medicine(validMedicineData);
      const savedMedicine = await medicine.save();
      
      expect(savedMedicine.images).toHaveLength(0);
    });
  });

  describe('Timestamps', () => {
    test('should automatically add createdAt and updatedAt', async () => {
      const medicine = new Medicine(validMedicineData);
      const savedMedicine = await medicine.save();

      expect(savedMedicine.createdAt).toBeDefined();
      expect(savedMedicine.updatedAt).toBeDefined();
      expect(savedMedicine.createdAt).toBeInstanceOf(Date);
      expect(savedMedicine.updatedAt).toBeInstanceOf(Date);
    });

    test('should update updatedAt on save', async () => {
      const medicine = await new Medicine(validMedicineData).save();
      const originalUpdatedAt = medicine.updatedAt;

      // Wait a bit and update
      await new Promise(resolve => setTimeout(resolve, 10));
      medicine.stock = 150;
      await medicine.save();

      expect(medicine.updatedAt).not.toEqual(originalUpdatedAt);
    });
  });

  describe('JSON and Object Conversion', () => {
    test('should include virtuals in JSON', async () => {
      const medicine = new Medicine({
        ...validMedicineData,
        mrp: 100,
        price: 80,
        stock: 5
      });

      const json = medicine.toJSON();
      expect(json.discountPercent).toBe(20);
      expect(json.stockStatus).toBe('low-stock');
    });

    test('should include virtuals in object', async () => {
      const medicine = new Medicine({
        ...validMedicineData,
        mrp: 100,
        price: 80,
        stock: 0
      });

      const obj = medicine.toObject();
      expect(obj.discountPercent).toBe(20);
      expect(obj.stockStatus).toBe('out-of-stock');
    });
  });
});