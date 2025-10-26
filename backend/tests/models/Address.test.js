const Address = require('../../src/models/Address');
const User = require('../../src/models/User');

describe('Address Model', () => {
  let testUser;

  beforeEach(async () => {
    // Create a test user
    testUser = await new User({
      phoneNumber: '+1234567890',
      name: 'Test User'
    }).save();
  });

  const validAddressData = {
    contactPerson: 'John Doe',
    phoneNumber: '+1234567890',
    addressLine1: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    location: {
      coordinates: [72.8777, 19.0760] // Mumbai coordinates
    }
  };

  describe('Address Schema Validation', () => {
    test('should create address with valid data', async () => {
      const addressData = {
        ...validAddressData,
        user: testUser._id
      };

      const address = new Address(addressData);
      const savedAddress = await address.save();

      expect(savedAddress.contactPerson).toBe(addressData.contactPerson);
      expect(savedAddress.phoneNumber).toBe(addressData.phoneNumber);
      expect(savedAddress.city).toBe(addressData.city);
      expect(savedAddress.type).toBe('Home'); // default value
      expect(savedAddress.isDefault).toBe(true); // first address should be default
      expect(savedAddress.isActive).toBe(true); // default value
      expect(savedAddress.country).toBe('India'); // default value
    });

    test('should require user reference', async () => {
      const addressData = { ...validAddressData };

      const address = new Address(addressData);
      await expect(address.save()).rejects.toThrow('User reference is required');
    });

    test('should require contact person', async () => {
      const addressData = { ...validAddressData, user: testUser._id };
      delete addressData.contactPerson;

      const address = new Address(addressData);
      await expect(address.save()).rejects.toThrow('Contact person name is required');
    });

    test('should require phone number', async () => {
      const addressData = { ...validAddressData, user: testUser._id };
      delete addressData.phoneNumber;

      const address = new Address(addressData);
      await expect(address.save()).rejects.toThrow('Phone number is required');
    });

    test('should validate phone number format', async () => {
      const addressData = {
        ...validAddressData,
        user: testUser._id,
        phoneNumber: 'invalid-phone'
      };

      const address = new Address(addressData);
      await expect(address.save()).rejects.toThrow('Please enter a valid phone number');
    });

    test('should validate alternate phone number format', async () => {
      const addressData = {
        ...validAddressData,
        user: testUser._id,
        alternatePhone: 'invalid-phone'
      };

      const address = new Address(addressData);
      await expect(address.save()).rejects.toThrow('Please enter a valid alternate phone number');
    });

    test('should allow empty alternate phone number', async () => {
      const addressData = {
        ...validAddressData,
        user: testUser._id,
        alternatePhone: ''
      };

      const address = new Address(addressData);
      const savedAddress = await address.save();
      expect(savedAddress.alternatePhone).toBe('');
    });

    test('should require address line 1', async () => {
      const addressData = { ...validAddressData, user: testUser._id };
      delete addressData.addressLine1;

      const address = new Address(addressData);
      await expect(address.save()).rejects.toThrow('Address line 1 is required');
    });

    test('should require city', async () => {
      const addressData = { ...validAddressData, user: testUser._id };
      delete addressData.city;

      const address = new Address(addressData);
      await expect(address.save()).rejects.toThrow('City is required');
    });

    test('should require state', async () => {
      const addressData = { ...validAddressData, user: testUser._id };
      delete addressData.state;

      const address = new Address(addressData);
      await expect(address.save()).rejects.toThrow('State is required');
    });

    test('should require pincode', async () => {
      const addressData = { ...validAddressData, user: testUser._id };
      delete addressData.pincode;

      const address = new Address(addressData);
      await expect(address.save()).rejects.toThrow('Pincode is required');
    });

    test('should validate pincode format', async () => {
      const addressData = {
        ...validAddressData,
        user: testUser._id,
        pincode: '12345' // Invalid: not 6 digits
      };

      const address = new Address(addressData);
      await expect(address.save()).rejects.toThrow('Please enter a valid 6-digit pincode');
    });

    test('should require coordinates', async () => {
      const addressData = { ...validAddressData, user: testUser._id };
      delete addressData.location;

      const address = new Address(addressData);
      await expect(address.save()).rejects.toThrow('Coordinates are required');
    });

    test('should validate coordinate format', async () => {
      const addressData = {
        ...validAddressData,
        user: testUser._id,
        location: {
          coordinates: [200, 100] // Invalid: longitude out of range
        }
      };

      const address = new Address(addressData);
      await expect(address.save()).rejects.toThrow('Please provide valid coordinates');
    });

    test('should validate type enum', async () => {
      const addressData = {
        ...validAddressData,
        user: testUser._id,
        type: 'InvalidType'
      };

      const address = new Address(addressData);
      await expect(address.save()).rejects.toThrow();
    });

    test('should validate delivery time preference enum', async () => {
      const addressData = {
        ...validAddressData,
        user: testUser._id,
        deliveryTimePreference: 'invalid'
      };

      const address = new Address(addressData);
      await expect(address.save()).rejects.toThrow();
    });

    test('should enforce length limits', async () => {
      const addressData = {
        ...validAddressData,
        user: testUser._id,
        contactPerson: 'a'.repeat(101), // Exceeds 100 character limit
      };

      const address = new Address(addressData);
      await expect(address.save()).rejects.toThrow('Contact person name cannot exceed 100 characters');
    });
  });

  describe('Virtual Properties', () => {
    test('should generate full address', async () => {
      const address = new Address({
        ...validAddressData,
        user: testUser._id,
        addressLine2: 'Apartment 5B',
        landmark: 'Near City Mall',
        area: 'Bandra West'
      });

      const expectedFullAddress = '123 Main Street, Apartment 5B, Near City Mall, Bandra West, Mumbai, Maharashtra - 400001';
      expect(address.fullAddress).toBe(expectedFullAddress);
    });

    test('should generate full address with minimal fields', async () => {
      const address = new Address({
        ...validAddressData,
        user: testUser._id
      });

      const expectedFullAddress = '123 Main Street, Mumbai, Maharashtra - 400001';
      expect(address.fullAddress).toBe(expectedFullAddress);
    });

    test('should return display label when label exists', () => {
      const address = new Address({
        ...validAddressData,
        user: testUser._id,
        label: 'My Home'
      });

      expect(address.displayLabel).toBe('My Home');
    });

    test('should return type when no label exists', () => {
      const address = new Address({
        ...validAddressData,
        user: testUser._id,
        type: 'Work'
      });

      expect(address.displayLabel).toBe('Work');
    });
  });

  describe('Instance Methods', () => {
    test('should set address as default', async () => {
      // Create two addresses
      const address1 = await new Address({
        ...validAddressData,
        user: testUser._id,
        contactPerson: 'Person 1'
      }).save();

      const address2 = await new Address({
        ...validAddressData,
        user: testUser._id,
        contactPerson: 'Person 2',
        phoneNumber: '+1234567891',
        addressLine1: '456 Second Street'
      }).save();

      // Set second address as default
      await address2.setAsDefault();

      // Reload addresses
      const updatedAddress1 = await Address.findById(address1._id);
      const updatedAddress2 = await Address.findById(address2._id);

      expect(updatedAddress1.isDefault).toBe(false);
      expect(updatedAddress2.isDefault).toBe(true);
    });

    test('should increment usage count and update last used', async () => {
      const address = await new Address({
        ...validAddressData,
        user: testUser._id,
        usageCount: 5
      }).save();

      const originalLastUsed = address.lastUsed;
      
      // Wait a moment to ensure time difference
      await new Promise(resolve => setTimeout(resolve, 10));
      
      await address.incrementUsage();

      expect(address.usageCount).toBe(6);
      expect(address.lastUsed).toBeDefined();
      if (originalLastUsed) {
        expect(address.lastUsed.getTime()).toBeGreaterThan(originalLastUsed.getTime());
      }
    });

    test('should verify address with method', async () => {
      const address = await new Address({
        ...validAddressData,
        user: testUser._id
      }).save();

      await address.verify('delivery');

      expect(address.isVerified).toBe(true);
      expect(address.verifiedAt).toBeInstanceOf(Date);
      expect(address.verificationMethod).toBe('delivery');
    });
  });

  describe('Static Methods', () => {
    test('should find nearby addresses', async () => {
      // Create addresses at different locations
      const nearbyAddress = await new Address({
        ...validAddressData,
        user: testUser._id,
        contactPerson: 'Nearby Person',
        location: { coordinates: [72.8800, 19.0800] } // Close to Mumbai
      }).save();

      const farAddress = await new Address({
        ...validAddressData,
        user: testUser._id,
        contactPerson: 'Far Person',
        phoneNumber: '+1234567891',
        addressLine1: '789 Far Street',
        location: { coordinates: [77.2090, 28.6139] } // Delhi coordinates
      }).save();

      const nearbyAddresses = await Address.findNearby([72.8777, 19.0760], 10000); // 10km radius

      expect(nearbyAddresses).toHaveLength(1);
      expect(nearbyAddresses[0]._id.toString()).toBe(nearbyAddress._id.toString());
    });

    test('should find addresses by pincode', async () => {
      await new Address({
        ...validAddressData,
        user: testUser._id,
        pincode: '400001'
      }).save();

      await new Address({
        ...validAddressData,
        user: testUser._id,
        contactPerson: 'Different Person',
        phoneNumber: '+1234567891',
        addressLine1: '456 Different Street',
        pincode: '400002',
        location: { coordinates: [72.8800, 19.0800] }
      }).save();

      const addresses = await Address.findByPincode('400001');
      expect(addresses).toHaveLength(1);
      expect(addresses[0].pincode).toBe('400001');
    });

    test('should get user addresses ordered correctly', async () => {
      const address1 = await new Address({
        ...validAddressData,
        user: testUser._id,
        contactPerson: 'Person 1',
        usageCount: 5
      }).save();

      const address2 = await new Address({
        ...validAddressData,
        user: testUser._id,
        contactPerson: 'Person 2',
        phoneNumber: '+1234567891',
        addressLine1: '456 Second Street',
        location: { coordinates: [72.8800, 19.0800] },
        usageCount: 10
      }).save();

      // Set address2 as default
      await address2.setAsDefault();

      const userAddresses = await Address.getUserAddresses(testUser._id);

      expect(userAddresses).toHaveLength(2);
      expect(userAddresses[0]._id.toString()).toBe(address2._id.toString()); // Default first
      expect(userAddresses[1]._id.toString()).toBe(address1._id.toString());
    });

    test('should get default address', async () => {
      const address1 = await new Address({
        ...validAddressData,
        user: testUser._id,
        contactPerson: 'Person 1'
      }).save();

      const address2 = await new Address({
        ...validAddressData,
        user: testUser._id,
        contactPerson: 'Person 2',
        phoneNumber: '+1234567891',
        addressLine1: '456 Second Street',
        location: { coordinates: [72.8800, 19.0800] }
      }).save();

      // Set address2 as default
      await address2.setAsDefault();

      const defaultAddress = await Address.getDefaultAddress(testUser._id);

      expect(defaultAddress._id.toString()).toBe(address2._id.toString());
      expect(defaultAddress.isDefault).toBe(true);
    });

    test('should return null when no default address exists', async () => {
      const anotherUser = await new User({
        phoneNumber: '+9876543210',
        name: 'Another User'
      }).save();

      const defaultAddress = await Address.getDefaultAddress(anotherUser._id);
      expect(defaultAddress).toBeNull();
    });
  });

  describe('Pre-save Middleware', () => {
    test('should set first address as default', async () => {
      const address = new Address({
        ...validAddressData,
        user: testUser._id
      });

      await address.save();
      expect(address.isDefault).toBe(true);
    });

    test('should not automatically set subsequent addresses as default', async () => {
      // Create first address
      await new Address({
        ...validAddressData,
        user: testUser._id,
        contactPerson: 'First Person'
      }).save();

      // Create second address
      const secondAddress = new Address({
        ...validAddressData,
        user: testUser._id,
        contactPerson: 'Second Person',
        phoneNumber: '+1234567891',
        addressLine1: '456 Second Street',
        location: { coordinates: [72.8800, 19.0800] }
      });

      await secondAddress.save();
      expect(secondAddress.isDefault).toBe(false);
    });

    test('should remove default from other addresses when setting new default', async () => {
      // Create two addresses
      const address1 = await new Address({
        ...validAddressData,
        user: testUser._id,
        contactPerson: 'Person 1'
      }).save();

      const address2 = await new Address({
        ...validAddressData,
        user: testUser._id,
        contactPerson: 'Person 2',
        phoneNumber: '+1234567891',
        addressLine1: '456 Second Street',
        location: { coordinates: [72.8800, 19.0800] }
      }).save();

      // Manually set second address as default
      address2.isDefault = true;
      await address2.save();

      // Reload first address and check it's no longer default
      const updatedAddress1 = await Address.findById(address1._id);
      expect(updatedAddress1.isDefault).toBe(false);
      expect(address2.isDefault).toBe(true);
    });
  });

  describe('Default Values', () => {
    test('should set default values correctly', () => {
      const address = new Address({
        ...validAddressData,
        user: testUser._id
      });

      expect(address.type).toBe('Home');
      expect(address.isDefault).toBe(false);
      expect(address.isActive).toBe(true);
      expect(address.country).toBe('India');
      expect(address.deliveryTimePreference).toBe('anytime');
      expect(address.usageCount).toBe(0);
      expect(address.isVerified).toBe(false);
      expect(address.location.type).toBe('Point');
    });
  });

  describe('JSON Serialization', () => {
    test('should include virtuals in JSON output', () => {
      const address = new Address({
        ...validAddressData,
        user: testUser._id,
        addressLine2: 'Apartment 5B',
        landmark: 'Near Mall',
        area: 'Bandra'
      });

      const json = address.toJSON();
      expect(json.fullAddress).toBeDefined();
      expect(json.displayLabel).toBeDefined();
    });
  });
});