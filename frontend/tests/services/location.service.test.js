import locationService from '../../src/services/location.service';

// Mock fetch API
global.fetch = jest.fn();

// Mock Geolocation API
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn()
};

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true
});

describe('Location Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  describe('Location service gets coordinates', () => {
    test('should get current position successfully', async () => {
      const mockPosition = {
        coords: {
          latitude: 12.9716,
          longitude: 77.5946,
          accuracy: 10
        },
        timestamp: Date.now()
      };

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });

      const result = await locationService.getCurrentPosition();

      expect(result.success).toBe(true);
      expect(result.position.coords.latitude).toBe(12.9716);
      expect(result.position.coords.longitude).toBe(77.5946);
    });

    test('should reverse geocode coordinates to address', async () => {
      const mockResponse = {
        display_name: 'Koramangala, Bangalore, Karnataka, India',
        address: {
          house_number: '123',
          road: 'Main Road',
          suburb: 'Koramangala',
          city: 'Bangalore',
          state: 'Karnataka',
          postcode: '560034',
          country: 'India'
        }
      };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const result = await locationService.reverseGeocode(12.9716, 77.5946);

      expect(result.success).toBe(true);
      expect(result.address.area).toBe('Koramangala');
      expect(result.address.city).toBe('Bangalore');
      expect(result.address.pincode).toBe('560034');
    });
  });

  describe('Location permission denied', () => {
    test('should handle location permission denied', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error({
          code: 1, // PERMISSION_DENIED
          message: 'User denied the request for Geolocation.'
        });
      });

      const result = await locationService.getCurrentPosition();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Location access denied');
    });

    test('should handle location unavailable', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error({
          code: 2, // POSITION_UNAVAILABLE
          message: 'Location information is unavailable.'
        });
      });

      const result = await locationService.getCurrentPosition();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Location unavailable');
    });

    test('should handle timeout error', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error({
          code: 3, // TIMEOUT
          message: 'The request to get user location timed out.'
        });
      });

      const result = await locationService.getCurrentPosition();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Location request timed out');
    });
  });

  describe('Geocoding functionality', () => {
    test('should forward geocode address to coordinates', async () => {
      const mockResponse = [
        {
          lat: '12.9716',
          lon: '77.5946',
          display_name: 'Koramangala, Bangalore, Karnataka, India'
        }
      ];

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const result = await locationService.forwardGeocode('Koramangala Bangalore');

      expect(result.success).toBe(true);
      expect(result.coordinates.latitude).toBe(12.9716);
      expect(result.coordinates.longitude).toBe(77.5946);
    });

    test('should calculate distance between coordinates', () => {
      const distance = locationService.calculateDistance(
        12.9716, 77.5946, // Koramangala
        12.9352, 77.6245  // Electronic City
      );

      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(50); // Should be within 50km
    });

    test('should check if location is within delivery radius', () => {
      const isWithinRadius = locationService.isWithinDeliveryRadius(
        12.9716, 77.5946, // User location
        12.9716, 77.5946, // Store location (same)
        10 // 10km radius
      );

      expect(isWithinRadius).toBe(true);
    });
  });
});