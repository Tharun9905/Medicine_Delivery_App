import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import locationService from '../../services/location.service';
import LoadingSpinner from './LoadingSpinner';

export default function LocationPicker({ onLocationSelect, initialValue = null }) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(initialValue);
  const [formAddress, setFormAddress] = useState({
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'home' // home, work, other
  });

  // Initialize form with initial value
  useEffect(() => {
    if (initialValue) {
      setSelectedLocation(initialValue);
      if (initialValue.address) {
        setFormAddress({
          street: initialValue.address.street || '',
          landmark: initialValue.landmark || '',
          city: initialValue.address.city || '',
          state: initialValue.address.state || '',
          pincode: initialValue.address.pincode || '',
          addressType: initialValue.type || 'home'
        });
      }
    }
  }, [initialValue]);

  const detectCurrentLocation = async () => {
    setIsDetecting(true);
    try {
      const locationData = await locationService.getCurrentLocationWithAddress();
      
      const fullAddress = {
        ...locationData,
        landmark: '',
        type: 'home',
        isCurrentLocation: true
      };
      
      setSelectedLocation(fullAddress);
      setFormAddress({
        street: locationData.address.street || '',
        landmark: '',
        city: locationData.address.city || '',
        state: locationData.address.state || '',
        pincode: locationData.address.pincode || '',
        addressType: 'home'
      });
      
      toast.success('Location detected successfully!');
      
      if (onLocationSelect) {
        onLocationSelect(fullAddress);
      }
    } catch (error) {
      console.error('Location detection error:', error);
      toast.error(error.message || 'Unable to detect location');
      setManualMode(true);
    } finally {
      setIsDetecting(false);
    }
  };

  const searchLocation = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await locationService.geocode(query);
      setSearchResults(results.slice(0, 5)); // Limit to 5 results
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Unable to search locations');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (result) => {
    const fullAddress = {
      position: {
        latitude: result.latitude,
        longitude: result.longitude
      },
      address: {
        formatted: result.formatted,
        street: result.formatted.split(',')[0] || '',
        city: result.formatted.split(',')[1] || '',
        state: result.formatted.split(',')[2] || '',
        pincode: '',
        country: 'India'
      },
      landmark: '',
      type: formAddress.addressType,
      isCurrentLocation: false
    };

    setSelectedLocation(fullAddress);
    setFormAddress({
      ...formAddress,
      street: fullAddress.address.street,
      city: fullAddress.address.city,
      state: fullAddress.address.state
    });
    setSearchQuery('');
    setSearchResults([]);

    if (onLocationSelect) {
      onLocationSelect(fullAddress);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!formAddress.street || !formAddress.city || !formAddress.pincode) {
      toast.error('Please fill all required fields');
      return;
    }

    const fullAddress = {
      position: selectedLocation?.position || null,
      address: {
        formatted: `${formAddress.street}, ${formAddress.city}, ${formAddress.state} ${formAddress.pincode}`,
        street: formAddress.street,
        city: formAddress.city,
        state: formAddress.state,
        pincode: formAddress.pincode,
        country: 'India'
      },
      landmark: formAddress.landmark,
      type: formAddress.addressType,
      isCurrentLocation: false
    };

    setSelectedLocation(fullAddress);

    if (onLocationSelect) {
      onLocationSelect(fullAddress);
    }

    toast.success('Address saved successfully!');
  };

  const handleFormChange = (field, value) => {
    setFormAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery Address</h3>
        <p className="text-sm text-gray-600">Choose or enter your delivery address</p>
      </div>

      {/* Quick Location Detection */}
      {!manualMode && !selectedLocation && (
        <div className="space-y-4">
          <button
            onClick={detectCurrentLocation}
            disabled={isDetecting}
            className="w-full flex items-center justify-center py-3 px-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDetecting ? (
              <>
                <LoadingSpinner size="small" color="white" className="mr-2" />
                Detecting location...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Use current location
              </>
            )}
          </button>

          <div className="text-center">
            <button
              onClick={() => setManualMode(true)}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Enter address manually
            </button>
          </div>
        </div>
      )}

      {/* Search Location */}
      {(manualMode || selectedLocation) && (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search for area, street name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                searchLocation(e.target.value);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <LoadingSpinner size="small" />
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => selectSearchResult(result)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{result.formatted}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Address Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="House no, Building name, Street"
                  value={formAddress.street}
                  onChange={(e) => handleFormChange('street', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Nearby landmark"
                  value={formAddress.landmark}
                  onChange={(e) => handleFormChange('landmark', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={formAddress.city}
                    onChange={(e) => handleFormChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={formAddress.state}
                    onChange={(e) => handleFormChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Pincode"
                  value={formAddress.pincode}
                  onChange={(e) => handleFormChange('pincode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Type
                </label>
                <select
                  value={formAddress.addressType}
                  onChange={(e) => handleFormChange('addressType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Save Address
            </button>
          </form>
        </div>
      )}

      {/* Selected Location Display */}
      {selectedLocation && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900">Selected Address</p>
              <p className="text-sm text-green-700 mt-1">
                {selectedLocation.address?.formatted || 'Custom address'}
              </p>
              {selectedLocation.landmark && (
                <p className="text-xs text-green-600 mt-1">
                  Landmark: {selectedLocation.landmark}
                </p>
              )}
              {selectedLocation.isCurrentLocation && (
                <p className="text-xs text-green-600 mt-1">
                  📍 Current location detected
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setSelectedLocation(null);
                setManualMode(true);
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="text-green-600 hover:text-green-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {!selectedLocation && manualMode && (
        <div className="text-center">
          <button
            onClick={() => {
              setManualMode(false);
              detectCurrentLocation();
            }}
            className="text-sm text-primary-600 hover:text-primary-700 underline"
          >
            Use current location instead
          </button>
        </div>
      )}
    </div>
  );
}