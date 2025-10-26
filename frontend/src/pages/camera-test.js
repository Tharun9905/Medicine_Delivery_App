import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../components/common/Layout';
import CameraCapture from '../components/common/CameraCapture';

export default function CameraTest() {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [cameraSupported, setCameraSupported] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('checking');

  useEffect(() => {
    checkCameraSupport();
  }, []);

  const checkCameraSupport = async () => {
    // Check if browser supports getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraSupported(false);
      setPermissionStatus('unsupported');
      toast.error('Camera not supported on this browser');
      return;
    }

    setCameraSupported(true);

    // Check camera permission
    try {
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'camera' });
        setPermissionStatus(permission.state);
        
        permission.onchange = () => {
          setPermissionStatus(permission.state);
        };
      } else {
        setPermissionStatus('unknown');
      }
    } catch (error) {
      console.error('Permission check error:', error);
      setPermissionStatus('unknown');
    }
  };

  const openCamera = async () => {
    if (!cameraSupported) {
      toast.error('Camera not supported on this device');
      return;
    }

    try {
      // Test camera access before opening full camera UI
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      
      // Stop the test stream
      stream.getTracks().forEach(track => track.stop());
      
      // Now open the camera UI
      setCameraOpen(true);
      setPermissionStatus('granted');
      
    } catch (error) {
      console.error('Camera access error:', error);
      
      let errorMessage = 'Unable to access camera';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access and try again.';
        setPermissionStatus('denied');
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device';
        setPermissionStatus('unavailable');
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Camera not supported on this browser';
        setPermissionStatus('unsupported');
      }
      
      toast.error(errorMessage);
    }
  };

  const handleCameraCapture = (capturedFile) => {
    const imageUrl = URL.createObjectURL(capturedFile);
    const newImage = {
      id: Date.now(),
      url: imageUrl,
      file: capturedFile,
      timestamp: new Date().toLocaleString()
    };
    
    setCapturedImages(prev => [newImage, ...prev]);
    setCameraOpen(false);
    toast.success('Image captured successfully!');
  };

  const deleteImage = (imageId) => {
    setCapturedImages(prev => {
      const imageToDelete = prev.find(img => img.id === imageId);
      if (imageToDelete) {
        URL.revokeObjectURL(imageToDelete.url);
      }
      return prev.filter(img => img.id !== imageId);
    });
    toast.success('Image deleted');
  };

  const clearAllImages = () => {
    capturedImages.forEach(image => {
      URL.revokeObjectURL(image.url);
    });
    setCapturedImages([]);
    toast.success('All images cleared');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Camera Test & Prescription Upload</h1>
        
        {/* Camera Support Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Camera Support Status</h2>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                cameraSupported === true ? 'bg-green-500' :
                cameraSupported === false ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-gray-700">
                Camera Support: {
                  cameraSupported === true ? 'Supported' :
                  cameraSupported === false ? 'Not Supported' : 'Checking...'
                }
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                permissionStatus === 'granted' ? 'bg-green-500' :
                permissionStatus === 'denied' ? 'bg-red-500' :
                permissionStatus === 'prompt' ? 'bg-yellow-500' : 'bg-gray-500'
              }`}></div>
              <span className="text-gray-700 capitalize">
                Permission: {permissionStatus}
              </span>
            </div>
          </div>

          {permissionStatus === 'denied' && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">
                <strong>Camera Blocked:</strong> Please enable camera access:
              </p>
              <ul className="mt-2 text-xs text-red-700 space-y-1 ml-4">
                <li>• Chrome: Click camera icon in address bar → Always allow</li>
                <li>• Safari: Settings → Websites → Camera → This Website → Allow</li>
                <li>• Firefox: Address bar → Camera icon → Enable camera</li>
              </ul>
            </div>
          )}
        </div>

        {/* Camera Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Camera Controls</h2>
          
          <div className="space-y-4">
            <button
              onClick={openCamera}
              disabled={!cameraSupported || permissionStatus === 'denied'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Open Camera</span>
            </button>

            <p className="text-sm text-gray-600">
              Use the camera to capture prescriptions or medical documents. 
              The camera will open in full screen mode with capture guidelines.
            </p>
          </div>
        </div>

        {/* Captured Images */}
        {capturedImages.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Captured Images ({capturedImages.length})
              </h2>
              <button
                onClick={clearAllImages}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {capturedImages.map((image) => (
                <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="relative">
                    <img
                      src={image.url}
                      alt={`Captured at ${image.timestamp}`}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => deleteImage(image.id)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-600">{image.timestamp}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Size: {(image.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">📝 How to use the Camera</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Click "Open Camera" to start capturing</li>
            <li>• Position your prescription within the guidelines</li>
            <li>• Ensure good lighting and clear text</li>
            <li>• Tap the white circle to capture</li>
            <li>• Review and confirm or retake if needed</li>
            <li>• Multiple images can be captured</li>
          </ul>
        </div>

        {/* Camera Modal */}
        {cameraOpen && (
          <CameraCapture
            isOpen={cameraOpen}
            onCapture={handleCameraCapture}
            onClose={() => setCameraOpen(false)}
          />
        )}
      </div>
    </Layout>
  );
}