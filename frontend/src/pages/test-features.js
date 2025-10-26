import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../components/common/Layout';
import CameraCapture from '../components/common/CameraCapture';
import locationService from '../services/location.service';
import authService from '../services/auth.service';

export default function TestFeatures() {
  // OTP Testing State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTestResult, setOtpTestResult] = useState(null);

  // Camera Testing State
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraTestResult, setCameraTestResult] = useState(null);

  // Location Testing State
  const [locationLoading, setLocationLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationTestResult, setLocationTestResult] = useState(null);

  // OTP Test Functions
  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    try {
      setOtpLoading(true);
      const response = await authService.sendOTP(phoneNumber);
      
      if (response.success) {
        setOtpSent(true);
        setOtpTestResult({ success: true, message: 'OTP sent successfully!' });
        toast.success('OTP sent successfully!');
        
        // Show development OTP if available
        if (response.otp) {
          console.log('Development OTP:', response.otp);
          toast.success(`Development OTP: ${response.otp}`, { 
            duration: 15000,
            style: { background: '#059669', color: 'white' }
          });
        }
      }
    } catch (error) {
      setOtpTestResult({ success: false, message: error.message });
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter valid 6-digit OTP');
      return;
    }

    try {
      setOtpLoading(true);
      const response = await authService.verifyOTP(phoneNumber, otp);
      
      if (response.success) {
        setOtpTestResult({ success: true, message: 'OTP verified successfully!' });
        toast.success('OTP verified successfully!');
      }
    } catch (error) {
      setOtpTestResult({ success: false, message: error.message });
      toast.error(error.message || 'OTP verification failed');
    } finally {
      setOtpLoading(false);
    }
  };

  // Camera Test Functions
  const handleCameraCapture = (imageData) => {
    setCapturedImage(imageData);
    setCameraTestResult({ success: true, message: 'Image captured successfully!' });
    setCameraOpen(false);
    toast.success('Image captured successfully!');
  };

  const handleCameraError = (error) => {
    setCameraTestResult({ success: false, message: error.message });
    setCameraOpen(false);
    toast.error('Camera error: ' + error.message);
  };

  const openCamera = () => {
    setCameraOpen(true);
    setCameraTestResult(null);
  };

  // Location Test Functions
  const handleGetLocation = async () => {
    try {
      setLocationLoading(true);
      setLocationTestResult(null);
      
      const position = await locationService.getCurrentPosition();
      
      setCurrentLocation(position);
      setLocationTestResult({ 
        success: true, 
        message: `Location found: ${position.latitude.toFixed(6)}, ${position.longitude.toFixed(6)}` 
      });
      toast.success('Location retrieved successfully!');
    } catch (error) {
      setLocationTestResult({ success: false, message: error.message });
      toast.error('Location error: ' + error.message);
    } finally {
      setLocationLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Feature Testing Page</h1>
        <p className="text-gray-600 mb-8">Test the core features: OTP, Camera, and Location access</p>

        {/* OTP Testing Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">📱 OTP Testing</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {!otpSent ? (
              <button
                onClick={handleSendOTP}
                disabled={otpLoading || !phoneNumber}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {otpLoading ? 'Sending...' : 'Send OTP'}
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    maxLength="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg font-mono"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleVerifyOTP}
                    disabled={otpLoading || otp.length !== 6}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {otpLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                      setOtpTestResult(null);
                    }}
                    className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {otpTestResult && (
              <div className={`p-4 rounded-md ${otpTestResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <p className="font-medium">{otpTestResult.success ? '✅ Success' : '❌ Error'}</p>
                <p>{otpTestResult.message}</p>
              </div>
            )}
          </div>
        </div>

        {/* Camera Testing Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">📷 Camera Testing</h2>
          
          <div className="space-y-4">
            <button
              onClick={openCamera}
              className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
            >
              Open Camera
            </button>

            {capturedImage && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Captured Image:</h3>
                <img 
                  src={capturedImage} 
                  alt="Captured" 
                  className="max-w-md max-h-64 object-contain border border-gray-300 rounded-md"
                />
              </div>
            )}

            {cameraTestResult && (
              <div className={`p-4 rounded-md ${cameraTestResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <p className="font-medium">{cameraTestResult.success ? '✅ Success' : '❌ Error'}</p>
                <p>{cameraTestResult.message}</p>
              </div>
            )}
          </div>
        </div>

        {/* Location Testing Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">📍 Location Testing</h2>
          
          <div className="space-y-4">
            <button
              onClick={handleGetLocation}
              disabled={locationLoading}
              className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50"
            >
              {locationLoading ? 'Getting Location...' : 'Get Current Location'}
            </button>

            {currentLocation && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Location Details:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li><strong>Latitude:</strong> {currentLocation.latitude}</li>
                  <li><strong>Longitude:</strong> {currentLocation.longitude}</li>
                  <li><strong>Accuracy:</strong> {currentLocation.accuracy} meters</li>
                  <li><strong>Timestamp:</strong> {new Date(currentLocation.timestamp).toLocaleString()}</li>
                </ul>
              </div>
            )}

            {locationTestResult && (
              <div className={`p-4 rounded-md ${locationTestResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <p className="font-medium">{locationTestResult.success ? '✅ Success' : '❌ Error'}</p>
                <p>{locationTestResult.message}</p>
              </div>
            )}
          </div>
        </div>

        {/* Camera Modal */}
        {cameraOpen && (
          <CameraCapture
            isOpen={cameraOpen}
            onCapture={handleCameraCapture}
            onClose={() => setCameraOpen(false)}
            onError={handleCameraError}
          />
        )}
      </div>
    </Layout>
  );
}