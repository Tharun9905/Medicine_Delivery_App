import { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import LoadingSpinner from '../components/common/LoadingSpinner';
import LocationPicker from '../components/common/LocationPicker';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export default function AddressesPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formData, setFormData] = useState({
    type: 'home',
    name: '',
    phoneNumber: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      // TODO: Implement address service API call
      // const response = await addressService.getUserAddresses();
      // setAddresses(response.addresses || []);
      setAddresses([]); // Temporary empty state
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'home',
      name: '',
      phoneNumber: '',
      street: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    });
    setErrors({});
    setEditingAddress(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowAddForm(true);
  };

  const handleEdit = (address) => {
    setFormData({
      type: address.type,
      name: address.name,
      phoneNumber: address.phoneNumber,
      street: address.street,
      landmark: address.landmark || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault
    });
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handleDelete = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      // TODO: Implement delete API call
      // await addressService.deleteAddress(addressId);
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';

    if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setSaving(true);
    try {
      if (editingAddress) {
        // TODO: Implement update API call
        // await addressService.updateAddress(editingAddress._id, formData);
      } else {
        // TODO: Implement create API call
        // await addressService.createAddress(formData);
      }

      setShowAddForm(false);
      resetForm();
      fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      setErrors({ general: 'Failed to save address. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const getAddressTypeIcon = (type) => {
    switch (type) {
      case 'home':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'office':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
    }
  };

  if (authLoading) {
    return (
      <Layout title="Addresses - MediQuick">
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
    <Layout title="Saved Addresses - MediQuick">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Addresses</h1>
              <p className="text-gray-600">Manage your delivery addresses</p>
            </div>
            <button
              onClick={handleAddNew}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New Address
            </button>
          </div>
        </div>

        {/* Add/Edit Address Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Address Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                  <div className="flex space-x-4">
                    {['home', 'office', 'other'].map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="radio"
                          name="type"
                          value={type}
                          checked={formData.type === type}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Name and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors.phoneNumber ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    />
                    {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                  <textarea
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-3 py-2 border ${errors.street ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  />
                  {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street}</p>}
                </div>

                {/* Landmark */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* City, State, Pincode */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors.city ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors.state ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    />
                    {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors.pincode ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    />
                    {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
                  </div>
                </div>

                {/* Default Address */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Make this my default address</label>
                </div>

                {/* Error Message */}
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{errors.general}</p>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : (editingAddress ? 'Update Address' : 'Save Address')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {/* Addresses List */}
        {!loading && (
          <>
            {addresses.length > 0 ? (
              <div className="space-y-4">
                {addresses.map(address => (
                  <div key={address._id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className="flex items-center text-primary-600 mr-3">
                            {getAddressTypeIcon(address.type)}
                            <span className="ml-1 font-medium capitalize">{address.type}</span>
                          </div>
                          {address.isDefault && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-1">{address.name}</h3>
                        <p className="text-gray-600 mb-1">{address.phoneNumber}</p>
                        
                        <div className="text-gray-700">
                          <p>{address.street}</p>
                          {address.landmark && <p>Near {address.landmark}</p>}
                          <p>{address.city}, {address.state} - {address.pincode}</p>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(address)}
                          className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(address._id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg className="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">No addresses saved</h3>
                <p className="text-gray-600 mb-8">Add your delivery addresses for faster checkout</p>
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add Your First Address
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}