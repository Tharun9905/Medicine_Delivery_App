import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../components/common/Layout';
import CameraCapture from '../components/common/CameraCapture';
import { useAuth } from '../contexts/AuthContext';

export default function UploadPrescription() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [patientInfo, setPatientInfo] = useState({
    patientName: '',
    age: '',
    gender: '',
    phoneNumber: user?.phoneNumber || '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [prescriptionId, setPrescriptionId] = useState(null);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }

      if (!file.type.match(/image.*/) && file.type !== 'application/pdf') {
        toast.error(`File ${file.name} is not supported. Please upload images or PDF.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile = {
          id: Date.now() + Math.random(),
          file: file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: e.target.result,
          uploadedAt: new Date()
        };
        
        setUploadedFiles(prev => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    event.target.value = '';
  };

  const handleCameraCapture = (imageFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newFile = {
        id: Date.now(),
        file: imageFile,
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type,
        preview: e.target.result,
        uploadedAt: new Date()
      };
      
      setUploadedFiles(prev => [...prev, newFile]);
      toast.success('Prescription captured successfully!');
    };
    reader.readAsDataURL(imageFile);
    setCameraOpen(false);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please login to upload prescription');
      return;
    }

    if (uploadedFiles.length === 0) {
      toast.error('Please upload at least one prescription image');
      return;
    }

    if (!patientInfo.patientName || !patientInfo.age || !patientInfo.phoneNumber) {
      toast.error('Please fill all required patient information');
      return;
    }

    try {
      setLoading(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      uploadedFiles.forEach((fileData, index) => {
        formData.append(`prescription_${index}`, fileData.file);
      });
      
      // Add patient information
      Object.keys(patientInfo).forEach(key => {
        formData.append(key, patientInfo[key]);
      });

      // Mock API call - In real implementation, this would upload to server
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockPrescriptionId = 'RX' + Date.now().toString().slice(-6);
      setPrescriptionId(mockPrescriptionId);
      
      toast.success('Prescription uploaded successfully!');
      
      // Reset form
      setUploadedFiles([]);
      setPatientInfo({
        patientName: '',
        age: '',
        gender: '',
        phoneNumber: user?.phoneNumber || '',
        notes: ''
      });
      
    } catch (error) {
      toast.error('Failed to upload prescription');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Prescription</h1>
          <p className="text-gray-600">Upload your prescription and get medicines delivered to your doorstep</p>
        </div>

        {prescriptionId ? (
          /* Success State */
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-900 mb-4">Prescription Uploaded Successfully!</h2>
            <p className="text-green-800 mb-4">
              Your prescription ID: <span className="font-mono font-bold text-lg">{prescriptionId}</span>
            </p>
            <p className="text-green-700 mb-6">
              Our pharmacist will review your prescription and contact you within 30 minutes with available medicines and pricing.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setPrescriptionId(null);
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
              >
                Upload Another
              </button>
              <button
                onClick={() => toast.info('Tracking feature coming soon!')}
                className="bg-white text-green-600 border border-green-600 px-6 py-2 rounded-md hover:bg-green-50"
              >
                Track Order
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Prescription Images</h2>
              
              {/* Upload Options */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h3 className="font-medium text-gray-900">Upload from Gallery</h3>
                    <p className="text-sm text-gray-500">Select images from your device</p>
                  </div>
                </button>

                <button
                  onClick={() => setCameraOpen(true)}
                  className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="font-medium text-gray-900">Take Photo</h3>
                    <p className="text-sm text-gray-500">Use camera to capture prescription</p>
                  </div>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Uploaded Files Preview */}
              {uploadedFiles.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Uploaded Files ({uploadedFiles.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          {file.type.startsWith('image/') ? (
                            <img
                              src={file.preview}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 18h12V6h-4V2H4v16zm-2 1V1h10l4 4v14H2z"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="mt-2 text-xs text-gray-600">
                          <p className="truncate">{file.name}</p>
                          <p>{formatFileSize(file.size)}</p>
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Patient Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Patient Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    value={patientInfo.patientName}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, patientName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    value={patientInfo.age}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter age"
                    min="1"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={patientInfo.gender}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={patientInfo.phoneNumber}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={patientInfo.notes}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any special instructions or notes..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={loading || uploadedFiles.length === 0}
                className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Uploading...' : 'Upload Prescription'}
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Our pharmacist will contact you within 30 minutes
              </p>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">📋 Upload Guidelines</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensure prescription is clearly visible and readable</li>
                <li>• Upload all pages if prescription spans multiple pages</li>
                <li>• Maximum file size: 5MB per image</li>
                <li>• Supported formats: JPG, PNG, PDF</li>
                <li>• Prescription should be valid (not expired)</li>
                <li>• Include doctor's signature and stamp</li>
              </ul>
            </div>
          </div>
        )}

        {/* Camera Modal */}
        {cameraOpen && (
          <CameraCapture
            isOpen={cameraOpen}
            onCapture={handleCameraCapture}
            onClose={() => setCameraOpen(false)}
            onError={(error) => {
              toast.error('Camera error: ' + error.message);
              setCameraOpen(false);
            }}
          />
        )}
      </div>
    </Layout>
  );
}