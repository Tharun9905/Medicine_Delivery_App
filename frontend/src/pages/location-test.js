import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../components/common/Layout';
import LocationPicker from '../components/common/LocationPicker';
import locationService from '../services/location.service';

export default function LocationTest() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('checking');

  // Check location permission on page load
  useState(() => {
    checkLocationSupport();
  }, []);

  const checkLocationSupport = async () => {
    try {
      const permission = await locationService.checkLocationPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        toast.success('Location permission is granted');
      } else if (permission === 'denied') {
        toast.error('Location permission is denied. Please enable in browser settings.');
      } else if (permission === 'unsupported') {
        toast.error('Location services not supported on this browser');
      }
    } catch (error) {
      console.error('Permission check error:', error);
      setPermissionStatus('error');
    }
  };

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      // First check and request permission
      const hasPermission = await locationService.requestLocationPermission();
      if (!hasPermission) {
        toast.error('Location permission is required');
        return;
      }

      // Get current location with address
      const locationData = await locationService.getCurrentLocationWithAddress();
      setCurrentLocation(locationData);
      
      toast.success('Location detected successfully!');
      console.log('Location data:', locationData);
      
    } catch (error) {
      console.error('Location error:', error);
      toast.error(error.message || 'Failed to get location');
      
      // If location fails, show manual location picker
      setShowLocationPicker(true);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleLocationSelect = (address) => {
    setSelectedAddress(address);
    setShowLocationPicker(false);
    toast.success('Address saved successfully!');
  };

  const resetLocationTest = () => {
    setCurrentLocation(null);
    setSelectedAddress(null);
    setShowLocationPicker(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Location Services Test</h1>
        
        {/* Permission Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Location Permission Status</h2>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              permissionStatus === 'granted' ? 'bg-green-500' :
              permissionStatus === 'denied' ? 'bg-red-500' :
              permissionStatus === 'prompt' ? 'bg-yellow-500' : 'bg-gray-500'
            }`}></div>
            <span className="capitalize text-gray-700">{permissionStatus}</span>
          </div>
          
          {permissionStatus === 'denied' && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">
                <strong>Location Blocked:</strong> Please enable location access in your browser settings:
              </p>
              <ul className="mt-2 text-xs text-red-700 space-y-1 ml-4">
                <li>• Chrome: Click the location icon in address bar → Always allow</li>
                <li>• Safari: Settings → Websites → Location → This Website → Allow</li>
                <li>• Firefox: Address bar → Shield icon → Enable location</li>
              </ul>
            </div>
          )}
        </div>

        {/* Location Detection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Automatic Location Detection</h2>
          
          <div className="space-y-4">
            <button
              onClick={getCurrentLocation}
              disabled={locationLoading || permissionStatus === 'denied'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {locationLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Detecting Location...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Get Current Location</span>
                </>
              )}
            </button>

            {currentLocation && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">✅ Location Detected</h3>
                <div className="text-sm text-green-800 space-y-1">
                  <p><strong>Coordinates:</strong> {currentLocation.position.latitude.toFixed(6)}, {currentLocation.position.longitude.toFixed(6)}</p>
                  <p><strong>Address:</strong> {currentLocation.address.formatted}</p>
                  <p><strong>Accuracy:</strong> ±{currentLocation.position.accuracy} meters</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Manual Location Picker */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Manual Address Entry</h2>
          
          <div className="space-y-4">
            <button
              onClick={() => setShowLocationPicker(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
            >
              Enter Address Manually
            </button>

            {selectedAddress && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">📍 Selected Address</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Address:</strong> {selectedAddress.address.formatted}</p>
                  <p><strong>Type:</strong> {selectedAddress.type}</p>
                  {selectedAddress.landmark && <p><strong>Landmark:</strong> {selectedAddress.landmark}</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={resetLocationTest}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Reset Test
          </button>
        </div>

        {/* Location Picker Modal */}
        {showLocationPicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Select Delivery Address</h3>
                  <button
                    onClick={() => setShowLocationPicker(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  initialValue={selectedAddress}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}