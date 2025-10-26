import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function CameraCapture({ onCapture, onClose, isOpen }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' for front, 'environment' for back
  const [capturedImage, setCapturedImage] = useState(null);

  // Initialize camera when component mounts or when reopened
  useEffect(() => {
    if (isOpen && !isInitialized) {
      initializeCamera();
    }
    
    // Cleanup on unmount or close
    return () => {
      if (streamRef.current) {
        stopCamera();
      }
    };
  }, [isOpen]);

  const initializeCamera = async () => {
    setIsCameraLoading(true);
    try {
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsInitialized(true);
        
        // Wait for video to load before showing it
        videoRef.current.onloadedmetadata = () => {
          setIsCameraLoading(false);
        };
      }
    } catch (error) {
      console.error('Camera initialization error:', error);
      let errorMessage = 'Unable to access camera';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera access denied. Please allow camera permissions and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Camera not supported on this browser';
      }
      
      toast.error(errorMessage);
      setIsCameraLoading(false);
      onClose();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    setIsInitialized(false);
  };

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) {
      toast.error('Camera not ready');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const imageUrl = URL.createObjectURL(blob);
          setCapturedImage(imageUrl);
        }
      },
      'image/jpeg',
      0.8
    );
  }, []);

  const retakeImage = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
      setCapturedImage(null);
    }
  };

  const confirmCapture = () => {
    if (!capturedImage || !canvasRef.current) return;

    canvasRef.current.toBlob(
      (blob) => {
        if (blob) {
          // Create a file object from blob
          const file = new File([blob], `prescription-${Date.now()}.jpg`, {
            type: 'image/jpeg'
          });
          onCapture(file);
          
          // Cleanup
          URL.revokeObjectURL(capturedImage);
          setCapturedImage(null);
          stopCamera();
          onClose();
        }
      },
      'image/jpeg',
      0.8
    );
  };

  const switchCamera = async () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    stopCamera();
    setIsInitialized(false);
    
    // Reinitialize with new facing mode
    setTimeout(() => {
      initializeCamera();
    }, 100);
  };

  const handleClose = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
      setCapturedImage(null);
    }
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black bg-opacity-50 p-4 flex items-center justify-between">
        <h3 className="text-white text-lg font-semibold">
          {capturedImage ? 'Review Photo' : 'Capture Prescription'}
        </h3>
        <button
          onClick={handleClose}
          className="text-white hover:text-gray-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Camera/Preview Area */}
      <div className="flex-1 relative">
        {isCameraLoading && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <div className="text-white text-center">
              <svg className="animate-spin h-8 w-8 text-white mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p>Initializing camera...</p>
            </div>
          </div>
        )}

        {capturedImage ? (
          // Preview captured image
          <img
            src={capturedImage}
            alt="Captured prescription"
            className="w-full h-full object-contain"
          />
        ) : (
          // Live camera feed
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${isCameraLoading ? 'opacity-0' : 'opacity-100'}`}
          />
        )}

        {/* Camera guidelines overlay */}
        {!capturedImage && !isCameraLoading && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner guidelines */}
            <div className="absolute top-20 left-10 w-8 h-8 border-t-2 border-l-2 border-white opacity-50"></div>
            <div className="absolute top-20 right-10 w-8 h-8 border-t-2 border-r-2 border-white opacity-50"></div>
            <div className="absolute bottom-32 left-10 w-8 h-8 border-b-2 border-l-2 border-white opacity-50"></div>
            <div className="absolute bottom-32 right-10 w-8 h-8 border-b-2 border-r-2 border-white opacity-50"></div>
            
            {/* Center guideline */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-40 border-2 border-dashed border-white opacity-30 rounded-lg"></div>
            
            {/* Instruction text */}
            <div className="absolute bottom-40 left-0 right-0 text-center">
              <p className="text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded-lg mx-auto inline-block">
                Position prescription within the frame
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-black bg-opacity-50 p-4">
        {capturedImage ? (
          // Preview controls
          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={retakeImage}
              className="flex items-center justify-center w-16 h-16 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            
            <button
              onClick={confirmCapture}
              className="flex items-center justify-center w-20 h-20 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        ) : (
          // Camera controls
          <div className="flex items-center justify-between">
            {/* Flash/Settings (placeholder) */}
            <div className="w-12"></div>
            
            {/* Capture controls */}
            <div className="flex items-center space-x-6">
              <button
                onClick={captureImage}
                disabled={!isInitialized || isCameraLoading}
                className="flex items-center justify-center w-20 h-20 bg-white rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-16 h-16 bg-transparent border-4 border-gray-300 rounded-full">
                  <div className="w-full h-full bg-white rounded-full"></div>
                </div>
              </button>
            </div>

            {/* Camera switch */}
            <button
              onClick={switchCamera}
              disabled={!isInitialized || isCameraLoading}
              className="flex items-center justify-center w-12 h-12 text-white hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-4 text-center">
          <p className="text-white text-xs opacity-75">
            {capturedImage 
              ? 'Review the image and confirm or retake'
              : 'Ensure the prescription is clear and readable'
            }
          </p>
        </div>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}