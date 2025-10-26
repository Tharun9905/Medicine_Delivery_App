const Medicine = require('../../src/models/Medicine');

describe('Medicine Model', () => {
  const validMedicineData = {
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
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
  };

  describe('Medicine Schema Validation', () => {
    test('should create medicine with valid data', async () => {
      const medicine = new Medicine(validMedicineData);
      const savedMedicine = await medicine.save();

      expect(savedMedicine.name).toBe(validMedicineData.name);
      expect(savedMedicine.brand).toBe(validMedicineData.brand);
      expect(savedMedicine.category).toBe(validMedicineData.category);
      expect(savedMedicine.status).toBe('active'); // default value
      expect(savedMedicine.stock).toBe(0); // default value
      expect(savedMedicine.rating.average).toBe(0); // default value
    });

    test('should require medicine name', async () => {
      const medicineData = { ...validMedicineData };
      delete medicineData.name;

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow('Medicine name is required');
    });

    test('should require brand', async () => {
      const medicineData = { ...validMedicineData };
      delete medicineData.brand;

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow('Brand is required');
    });

    test('should require manufacturer', async () => {
      const medicineData = { ...validMedicineData };
      delete medicineData.manufacturer;

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow('Manufacturer is required');
    });

    test('should require category', async () => {
      const medicineData = { ...validMedicineData };
      delete medicineData.category;

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow('Category is required');
    });

    test('should validate category enum', async () => {
      const medicineData = { ...validMedicineData, category: 'Invalid Category' };

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow();
    });

    test('should require dosage form', async () => {
      const medicineData = { ...validMedicineData };
      delete medicineData.dosageForm;

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow('Dosage form is required');
    });

    test('should validate dosage form enum', async () => {
      const medicineData = { ...validMedicineData, dosageForm: 'Invalid Form' };

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow();
    });

    test('should require strength', async () => {
      const medicineData = { ...validMedicineData };
      delete medicineData.strength;

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow('Strength is required');
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

    test('should require selling price', async () => {
      const medicineData = { ...validMedicineData };
      delete medicineData.sellingPrice;

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow('Selling price is required');
    });

    test('should not allow negative prices', async () => {
      const medicineData = { ...validMedicineData, mrp: -10 };

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow('Price cannot be negative');
    });

    test('should require unique SKU', async () => {
      await new Medicine(validMedicineData).save();

      const duplicateMedicine = new Medicine({
        ...validMedicineData,
        name: 'Different Medicine',
        sku: 'MED001' // Same SKU
      });

      await expect(duplicateMedicine.save()).rejects.toThrow();
    });

    test('should require expiry date', async () => {
      const medicineData = { ...validMedicineData };
      delete medicineData.expiryDate;

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow('Expiry date is required');
    });

    test('should validate discount range', async () => {
      const medicineData = { ...validMedicineData, discount: 150 };

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow('Discount cannot exceed 100%');
    });

    test('should not allow negative stock', async () => {
      const medicineData = { ...validMedicineData, stock: -5 };

      const medicine = new Medicine(medicineData);
      await expect(medicine.save()).rejects.toThrow('Stock cannot be negative');
    });
  });

  describe('Virtual Properties', () => {
    test('should calculate discount percentage correctly', async () => {
      const medicine = new Medicine({
        ...validMedicineData,
        mrp: 100,
        sellingPrice: 80
      });

      expect(medicine.discountPercent).toBe(20);
    });

    test('should return 0 discount when selling price equals MRP', async () => {
      const medicine = new Medicine({
        ...validMedicineData,
        mrp: 100,
        sellingPrice: 100
      });

      expect(medicine.discountPercent).toBe(0);
    });

    test('should return 0 discount when selling price is higher than MRP', async () => {
      const medicine = new Medicine({
        ...validMedicineData,
        mrp: 80,
        sellingPrice: 100
      });

      expect(medicine.discountPercent).toBe(0);
    });

    test('should determine stock status correctly', async () => {
      const outOfStockMedicine = new Medicine({
        ...validMedicineData,
        stock: 0
      });

      const lowStockMedicine = new Medicine({
        ...validMedicineData,
        stock: 5,
        minStockLevel: 10
      });

      const inStockMedicine = new Medicine({
        ...validMedicineData,
        stock: 50,
        minStockLevel: 10
      });

      expect(outOfStockMedicine.stockStatus).toBe('out-of-stock');
      expect(lowStockMedicine.stockStatus).toBe('low-stock');
      expect(inStockMedicine.stockStatus).toBe('in-stock');
    });

    test('should return primary image URL', async () => {
      const medicine = new Medicine({
        ...validMedicineData,
        images: [
          { url: 'image1.jpg', isPrimary: false },
          { url: 'image2.jpg', isPrimary: true },
          { url: 'image3.jpg', isPrimary: false }
        ]
      });

      expect(medicine.primaryImage).toBe('image2.jpg');
    });

    test('should return first image when no primary image set', async () => {
      const medicine = new Medicine({
        ...validMedicineData,
        images: [
          { url: 'image1.jpg' },
          { url: 'image2.jpg' }
        ]
      });

      expect(medicine.primaryImage).toBe('image1.jpg');
    });

    test('should return null when no images exist', async () => {
      const medicine = new Medicine(validMedicineData);
      expect(medicine.primaryImage).toBeNull();
    });

    test('should calculate days until expiry', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30); // 30 days from now

      const medicine = new Medicine({
        ...validMedicineData,
        expiryDate: futureDate
      });

      expect(medicine.daysUntilExpiry).toBe(30);
    });
  });

  describe('Instance Methods', () => {
    test('should update stock correctly - decrease', async () => {
      const medicine = await new Medicine({
        ...validMedicineData,
        stock: 50
      }).save();

      await medicine.updateStock(10, 'decrease');
      expect(medicine.stock).toBe(40);
    });

    test('should update stock correctly - increase', async () => {
      const medicine = await new Medicine({
        ...validMedicineData,
        stock: 50
      }).save();

      await medicine.updateStock(10, 'increase');
      expect(medicine.stock).toBe(60);
    });

    test('should throw error when decreasing stock below zero', async () => {
      const medicine = await new Medicine({
        ...validMedicineData,
        stock: 5
      }).save();

      await expect(medicine.updateStock(10, 'decrease'))
        .rejects
        .toThrow('Insufficient stock');
    });

    test('should update rating correctly', async () => {
      const medicine = await new Medicine({
        ...validMedicineData,
        rating: {
          average: 4.0,
          count: 10,
          breakdown: { 5: 5, 4: 3, 3: 2, 2: 0, 1: 0 }
        }
      }).save();

      await medicine.updateRating(5);

      expect(medicine.rating.count).toBe(11);
      expect(medicine.rating.breakdown[5]).toBe(6);
      expect(medicine.rating.average).toBeCloseTo(4.1, 1);
    });

    test('should increment view count', async () => {
      const medicine = await new Medicine({
        ...validMedicineData,
        viewCount: 10
      }).save();

      await medicine.incrementView();
      expect(medicine.viewCount).toBe(11);
    });

    test('should increment sales count', async () => {
      const medicine = await new Medicine({
        ...validMedicineData,
        salesCount: 20
      }).save();

      await medicine.incrementSales(5);
      expect(medicine.salesCount).toBe(25);
    });

    test('should increment sales count by 1 by default', async () => {
      const medicine = await new Medicine({
        ...validMedicineData,
        salesCount: 20
      }).save();

      await medicine.incrementSales();
      expect(medicine.salesCount).toBe(21);
    });
  });

  describe('Pre-save Middleware', () => {
    test('should auto-calculate discount', async () => {
      const medicine = new Medicine({
        ...validMedicineData,
        mrp: 100,
        sellingPrice: 80
      });

      await medicine.save();
      expect(medicine.discount).toBe(20);
    });

    test('should set first image as primary when no primary image exists', async () => {
      const medicine = new Medicine({
        ...validMedicineData,
        images: [
          { url: 'image1.jpg' },
          { url: 'image2.jpg' }
        ]
      });

      await medicine.save();
      expect(medicine.images[0].isPrimary).toBe(true);
      expect(medicine.images[1].isPrimary).toBe(false);
    });

    test('should ensure only one primary image', async () => {
      const medicine = new Medicine({
        ...validMedicineData,
        images: [
          { url: 'image1.jpg', isPrimary: true },
          { url: 'image2.jpg', isPrimary: true },
          { url: 'image3.jpg', isPrimary: true }
        ]
      });

      await medicine.save();
      expect(medicine.images[0].isPrimary).toBe(true);
      expect(medicine.images[1].isPrimary).toBe(false);
      expect(medicine.images[2].isPrimary).toBe(false);
    });
  });

  describe('Static Methods', () => {
    beforeEach(async () => {
      // Create test medicines
      await Medicine.create([
        { ...validMedicineData, name: 'Medicine 1', sku: 'MED001', category: 'OTC', status: 'active' },
        { ...validMedicineData, name: 'Medicine 2', sku: 'MED002', category: 'Prescription', status: 'active' },
        { ...validMedicineData, name: 'Medicine 3', sku: 'MED003', category: 'OTC', status: 'inactive' }
      ]);
    });

    test('should find medicines by category', async () => {
      const otcMedicines = await Medicine.findByCategory('OTC');
      expect(otcMedicines).toHaveLength(1); // Only active medicines
      expect(otcMedicines[0].name).toBe('Medicine 1');
    });

    test('should find popular medicines', async () => {
      // Update one medicine to be popular
      await Medicine.findOneAndUpdate(
        { name: 'Medicine 1' },
        { 
          isPopular: true,
          rating: { average: 4.5, count: 10 },
          salesCount: 100
        }
      );

      const popularMedicines = await Medicine.findPopular(5);
      expect(popularMedicines).toHaveLength(1);
      expect(popularMedicines[0].name).toBe('Medicine 1');
    });

    test('should find low stock medicines', async () => {
      // Create medicine with low stock
      await Medicine.create({
        ...validMedicineData,
        name: 'Low Stock Medicine',
        sku: 'MED004',
        stock: 5,
        minStockLevel: 10
      });

      const lowStockMedicines = await Medicine.findLowStock();
      expect(lowStockMedicines).toHaveLength(1);
      expect(lowStockMedicines[0].name).toBe('Low Stock Medicine');
    });

    test('should find expiring medicines', async () => {
      const nearExpiry = new Date();
      nearExpiry.setDate(nearExpiry.getDate() + 15); // 15 days from now

      await Medicine.create({
        ...validMedicineData,
        name: 'Expiring Medicine',
        sku: 'MED005',
        expiryDate: nearExpiry
      });

      const expiringMedicines = await Medicine.findExpiringMedicines(30);
      expect(expiringMedicines).toHaveLength(1);
      expect(expiringMedicines[0].name).toBe('Expiring Medicine');
    });
  });

  describe('Default Values', () => {
    test('should set correct default values', async () => {
      const medicine = new Medicine(validMedicineData);

      expect(medicine.discount).toBe(0);
      expect(medicine.gst).toBe(12);
      expect(medicine.stock).toBe(0);
      expect(medicine.minStockLevel).toBe(10);
      expect(medicine.maxStockLevel).toBe(1000);
      expect(medicine.requiresPrescription).toBe(false);
      expect(medicine.scheduleType).toBe('OTC');
      expect(medicine.rating.average).toBe(0);
      expect(medicine.rating.count).toBe(0);
      expect(medicine.salesCount).toBe(0);
      expect(medicine.viewCount).toBe(0);
      expect(medicine.isPopular).toBe(false);
      expect(medicine.isFeatured).toBe(false);
      expect(medicine.isNewArrival).toBe(false);
      expect(medicine.status).toBe('active');
    });
  });
});