import { toast } from 'react-hot-toast';

class LocationService {
  constructor() {
    this.isGeolocationSupported = 'geolocation' in navigator;
    this.currentPosition = null;
  }

  // Get current location using browser's geolocation API
  getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.isGeolocationSupported) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const defaultOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
        ...options
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          resolve(this.currentPosition);
        },
        (error) => {
          let errorMessage = 'Unable to get your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location permissions.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
            default:
              errorMessage = 'An unknown error occurred while getting location.';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        defaultOptions
      );
    });
  }

  // Watch position for continuous tracking
  watchPosition(callback, errorCallback, options = {}) {
    if (!this.isGeolocationSupported) {
      errorCallback && errorCallback(new Error('Geolocation is not supported by this browser'));
      return null;
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1 minute
      ...options
    };

    return navigator.geolocation.watchPosition(
      (position) => {
        this.currentPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        callback(this.currentPosition);
      },
      (error) => {
        let errorMessage = 'Unable to track your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        errorCallback && errorCallback(new Error(errorMessage));
      },
      defaultOptions
    );
  }

  // Clear watch
  clearWatch(watchId) {
    if (watchId && this.isGeolocationSupported) {
      navigator.geolocation.clearWatch(watchId);
    }
  }

  // Reverse geocoding using Nominatim (OpenStreetMap)
  async reverseGeocode(latitude, longitude) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Parse address components
      const address = data.address || {};
      
      return {
        formatted: data.display_name || '',
        street: this.buildStreetAddress(address),
        city: address.city || address.town || address.village || address.hamlet || '',
        state: address.state || '',
        pincode: address.postcode || '',
        country: address.country || '',
        latitude: parseFloat(data.lat),
        longitude: parseFloat(data.lon),
        raw: data
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  }

  // Forward geocoding (address to coordinates)
  async geocode(address) {
    try {
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=5&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }

      const data = await response.json();
      
      if (!data || data.length === 0) {
        throw new Error('No results found for the given address');
      }

      return data.map(result => ({
        formatted: result.display_name,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        importance: result.importance,
        raw: result
      }));
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  }

  // Get current location with address
  async getCurrentLocationWithAddress() {
    try {
      const position = await this.getCurrentPosition();
      const address = await this.reverseGeocode(position.latitude, position.longitude);
      
      return {
        position,
        address,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Get current location with address error:', error);
      throw error;
    }
  }

  // Calculate distance between two coordinates (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  // Check if location is within delivery area
  isWithinDeliveryRadius(userLat, userLon, centerLat, centerLon, radiusKm) {
    const distance = this.calculateDistance(userLat, userLon, centerLat, centerLon);
    return distance <= radiusKm;
  }

  // Helper methods
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  buildStreetAddress(address) {
    const components = [
      address.house_number,
      address.road || address.street,
      address.neighbourhood || address.suburb
    ].filter(Boolean);
    
    return components.join(', ');
  }

  // Check location permissions
  async checkLocationPermission() {
    if (!('permissions' in navigator)) {
      return 'unsupported';
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state; // 'granted', 'denied', or 'prompt'
    } catch (error) {
      return 'unsupported';
    }
  }

  // Request location permission
  async requestLocationPermission() {
    const permission = await this.checkLocationPermission();
    
    if (permission === 'granted') {
      return true;
    }
    
    if (permission === 'denied') {
      toast.error('Location access denied. Please enable location in browser settings.');
      return false;
    }

    // For 'prompt' or 'unsupported', try to get location (which will trigger permission prompt)
    try {
      await this.getCurrentPosition({ timeout: 5000 });
      return true;
    } catch (error) {
      console.error('Location permission request failed:', error);
      return false;
    }
  }

  // Get cached position if available and not expired
  getCachedPosition(maxAgeMs = 300000) { // 5 minutes default
    if (!this.currentPosition) return null;
    
    const now = Date.now();
    const age = now - this.currentPosition.timestamp;
    
    return age <= maxAgeMs ? this.currentPosition : null;
  }

  // Utility method for common location flow
  async getLocationOrPrompt() {
    try {
      // First try to get cached position
      const cached = this.getCachedPosition();
      if (cached) {
        return cached;
      }

      // Check permission first
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        throw new Error('Location permission required for delivery');
      }

      // Get current position
      const position = await this.getCurrentPosition();
      return position;
      
    } catch (error) {
      console.error('Location flow error:', error);
      throw error;
    }
  }
}

export default new LocationService();