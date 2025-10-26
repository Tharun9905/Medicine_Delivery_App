import { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CameraCapture from '../components/common/CameraCapture';
import { toast } from 'react-hot-toast';

export default function PrescriptionsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedFiles, setCapturedFiles] = useState([]);
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPrescriptions();
    }
  }, [isAuthenticated]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      // TODO: Implement prescription service API call
      // const response = await prescriptionService.getUserPrescriptions();
      // setPrescriptions(response.prescriptions || []);
      setPrescriptions([]); // Temporary empty state
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    uploadFiles(files);
  };

  const uploadFiles = async (files) => {
    setUploading(true);
    try {
      // TODO: Implement file upload logic
      // const formData = new FormData();
      // files.forEach(file => formData.append('prescriptions', file));
      // const response = await prescriptionService.uploadPrescriptions(formData);
      
      console.log('Uploading files:', files);
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`${files.length} prescription${files.length > 1 ? 's' : ''} uploaded successfully!`);
      setShowUpload(false);
      setCapturedFiles([]);
      fetchPrescriptions();
    } catch (error) {
      console.error('Error uploading prescriptions:', error);
      toast.error('Failed to upload prescriptions. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCameraCapture = (file) => {
    setCapturedFiles(prev => [...prev, file]);
    toast.success('Photo captured! You can take more photos or upload now.');
  };

  const handleUploadCaptured = () => {
    if (capturedFiles.length === 0) {
      toast.error('No photos to upload');
      return;
    }
    uploadFiles(capturedFiles);
  };

  const removeCapturedFile = (index) => {
    setCapturedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading) {
    return (
      <Layout title="Prescriptions - MediQuick">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <Layout title="My Prescriptions - MediQuick">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Prescriptions</h1>
              <p className="text-gray-600">Upload and manage your medical prescriptions</p>
            </div>
            <button
              onClick={() => setShowUpload(true)}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Prescription
            </button>
          </div>
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Upload Prescription</h3>
                <button
                  onClick={() => {
                    setShowUpload(false);
                    setCapturedFiles([]);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Camera and File Upload Options */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setShowCamera(true)}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-primary-300 rounded-lg hover:border-primary-400 transition-colors"
                  >
                    <svg className="w-12 h-12 text-primary-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium text-primary-600">Take Photo</span>
                  </button>

                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm font-medium text-gray-600 mb-2">Choose Files</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="prescription-upload"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="prescription-upload"
                      className="text-xs text-primary-600 hover:text-primary-700 cursor-pointer"
                    >
                      Browse files
                    </label>
                  </div>
                </div>

                {/* Captured Photos Preview */}
                {capturedFiles.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Captured Photos ({capturedFiles.length})</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {capturedFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Captured ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            onClick={() => removeCapturedFile(index)}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleUploadCaptured}
                      disabled={uploading}
                      className="w-full py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Uploading...
                        </>
                      ) : (
                        `Upload ${capturedFiles.length} Photo${capturedFiles.length > 1 ? 's' : ''}`
                      )}
                    </button>
                  </div>
                )}

                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Guidelines:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Upload clear, readable images</li>
                    <li>Accepted formats: JPG, PNG, PDF</li>
                    <li>Maximum file size: 5MB each</li>
                    <li>Include doctor's signature and date</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Camera Component */}
        <CameraCapture
          isOpen={showCamera}
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {/* Prescriptions List */}
        {!loading && (
          <>
            {prescriptions.length > 0 ? (
              <div className="space-y-6">
                {prescriptions.map(prescription => (
                  <div key={prescription._id} className="bg-white rounded-lg shadow-md p-6">
                    
                    {/* Prescription Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Prescription #{prescription.number}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Uploaded on {new Date(prescription.createdAt).toLocaleDateString()}
                        </p>
                        {prescription.doctorName && (
                          <p className="text-sm text-gray-600">
                            Dr. {prescription.doctorName}
                          </p>
                        )}
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prescription.status)}`}>
                          {prescription.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Prescription Images */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                      {prescription.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.url}
                            alt={`Prescription ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <button className="text-white hover:text-gray-200">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Prescription Details */}
                    {prescription.medicines && prescription.medicines.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Prescribed Medicines:</h4>
                        <div className="space-y-2">
                          {prescription.medicines.map(medicine => (
                            <div key={medicine._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium">{medicine.name}</p>
                                <p className="text-sm text-gray-600">{medicine.dosage}</p>
                              </div>
                              <button className="text-primary-600 hover:text-primary-700 font-medium">
                                Add to Cart
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {prescription.status === 'verified' && (
                        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                          Order Medicines
                        </button>
                      )}
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Download
                      </button>
                      <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg className="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">No prescriptions uploaded</h3>
                <p className="text-gray-600 mb-8">Upload your prescriptions to order medicines easily</p>
                <button
                  onClick={() => setShowUpload(true)}
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Your First Prescription
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}