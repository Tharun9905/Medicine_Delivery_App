/**
 * @jest-environment jsdom
 */

// Mock the geolocation API
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn()
};

global.navigator.geolocation = mockGeolocation;

// Mock fetch for reverse geocoding
global.fetch = jest.fn();

describe('Location Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset fetch mock
    fetch.mockClear();
  });

  describe('Geolocation Permission Tests', () => {
    test('should handle geolocation permission granted', async () => {
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

      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            expect(position.coords.latitude).toBe(12.9716);
            expect(position.coords.longitude).toBe(77.5946);
            resolve();
          },
          (error) => {
            fail('Should not reach error callback');
          }
        );
      });
    });

    test('should handle geolocation permission denied', async () => {
      const mockError = {
        code: 1, // PERMISSION_DENIED
        message: 'User denied the request for Geolocation.'
      };

      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error(mockError);
      });

      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fail('Should not reach success callback');
          },
          (error) => {
            expect(error.code).toBe(1);
            expect(error.message).toContain('denied');
            resolve();
          }
        );
      });
    });

    test('should handle geolocation timeout', async () => {
      const mockError = {
        code: 3, // TIMEOUT
        message: 'The request to get user location timed out.'
      };

      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error(mockError);
      });

      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fail('Should not reach success callback');
          },
          (error) => {
            expect(error.code).toBe(3);
            expect(error.message).toContain('timed out');
            resolve();
          }
        );
      });
    });

    test('should handle geolocation unavailable', async () => {
      const mockError = {
        code: 2, // POSITION_UNAVAILABLE
        message: 'Location information is unavailable.'
      };

      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error(mockError);
      });

      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fail('Should not reach success callback');
          },
          (error) => {
            expect(error.code).toBe(2);
            expect(error.message).toContain('unavailable');
            resolve();
          }
        );
      });
    });
  });

  describe('Reverse Geocoding Tests', () => {
    test('should successfully reverse geocode coordinates', async () => {
      const mockResponse = {
        display_name: 'Bangalore, Karnataka, India',
        address: {
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          postcode: '560001'
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const lat = 12.9716;
      const lon = 77.5946;
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      
      const data = await response.json();
      
      expect(data.display_name).toBe('Bangalore, Karnataka, India');
      expect(data.address.city).toBe('Bangalore');
      expect(data.address.state).toBe('Karnataka');
    });

    test('should handle reverse geocoding API failure', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      const lat = 12.9716;
      const lon = 77.5946;
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });

    test('should handle network error during reverse geocoding', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const lat = 12.9716;
      const lon = 77.5946;
      
      try {
        await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe('Network error');
      }
    });
  });

  describe('Location Accuracy Tests', () => {
    test('should handle high accuracy location', () => {
      const mockPosition = {
        coords: {
          latitude: 12.9716,
          longitude: 77.5946,
          accuracy: 5 // High accuracy
        }
      };

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });

      navigator.geolocation.getCurrentPosition((position) => {
        expect(position.coords.accuracy).toBeLessThan(10);
      });
    });

    test('should handle low accuracy location', () => {
      const mockPosition = {
        coords: {
          latitude: 12.9716,
          longitude: 77.5946,
          accuracy: 100 // Low accuracy
        }
      };

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });

      navigator.geolocation.getCurrentPosition((position) => {
        expect(position.coords.accuracy).toBeGreaterThan(50);
      });
    });
  });

  describe('Location Options Tests', () => {
    test('should use high accuracy option', () => {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      };

      navigator.geolocation.getCurrentPosition(
        jest.fn(),
        jest.fn(),
        options
      );

      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        options
      );
    });

    test('should use timeout option', () => {
      const options = {
        timeout: 5000
      };

      navigator.geolocation.getCurrentPosition(
        jest.fn(),
        jest.fn(),
        options
      );

      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        options
      );
    });
  });

  describe('Browser Compatibility Tests', () => {
    test('should detect geolocation support', () => {
      expect('geolocation' in navigator).toBe(true);
    });

    test('should handle missing geolocation support', () => {
      const originalGeolocation = global.navigator.geolocation;
      delete global.navigator.geolocation;

      expect('geolocation' in navigator).toBe(false);

      // Restore
      global.navigator.geolocation = originalGeolocation;
    });
  });

  describe('Location Validation Tests', () => {
    test('should validate latitude range', () => {
      const isValidLatitude = (lat) => lat >= -90 && lat <= 90;
      
      expect(isValidLatitude(12.9716)).toBe(true);
      expect(isValidLatitude(-90)).toBe(true);
      expect(isValidLatitude(90)).toBe(true);
      expect(isValidLatitude(-91)).toBe(false);
      expect(isValidLatitude(91)).toBe(false);
    });

    test('should validate longitude range', () => {
      const isValidLongitude = (lon) => lon >= -180 && lon <= 180;
      
      expect(isValidLongitude(77.5946)).toBe(true);
      expect(isValidLongitude(-180)).toBe(true);
      expect(isValidLongitude(180)).toBe(true);
      expect(isValidLongitude(-181)).toBe(false);
      expect(isValidLongitude(181)).toBe(false);
    });
  });
});