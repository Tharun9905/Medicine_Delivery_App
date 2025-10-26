import { useState } from 'react';
import Layout from '../components/common/Layout';
import {
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  MapPinIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

// Mock order tracking data
const mockOrderData = {
  'ORD123456': {
    orderId: 'ORD123456',
    status: 'in_transit',
    expectedDelivery: '2024-01-15 18:30',
    deliveryAddress: '123 Main Street, Apt 4B, Mumbai, Maharashtra 400001',
    deliveryPerson: {
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      image: '/images/delivery-person.jpg'
    },
    medicines: [
      { name: 'Paracetamol 500mg', quantity: 2, price: 45 },
      { name: 'Cough Syrup', quantity: 1, price: 120 }
    ],
    total: 165,
    timeline: [
      {
        status: 'order_placed',
        title: 'Order Placed',
        description: 'Your order has been confirmed',
        timestamp: '2024-01-15 14:30',
        completed: true
      },
      {
        status: 'prescription_verified',
        title: 'Prescription Verified',
        description: 'Prescription approved by our pharmacist',
        timestamp: '2024-01-15 14:45',
        completed: true
      },
      {
        status: 'medicines_packed',
        title: 'Medicines Packed',
        description: 'Your medicines are packed and ready for dispatch',
        timestamp: '2024-01-15 15:30',
        completed: true
      },
      {
        status: 'in_transit',
        title: 'Out for Delivery',
        description: 'Your order is on the way',
        timestamp: '2024-01-15 16:15',
        completed: true,
        current: true
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Order delivered successfully',
        timestamp: null,
        completed: false
      }
    ]
  }
};

export default function TrackOrderPage() {
  const [trackingId, setTrackingId] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      toast.error('Please enter a valid order ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = mockOrderData[trackingId.toUpperCase()];
      if (data) {
        setOrderData(data);
      } else {
        setError('Order not found. Please check your order ID and try again.');
        setOrderData(null);
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'order_placed': return 'bg-blue-500';
      case 'prescription_verified': return 'bg-green-500';
      case 'medicines_packed': return 'bg-yellow-500';
      case 'in_transit': return 'bg-purple-500';
      case 'delivered': return 'bg-green-600';
      default: return 'bg-gray-400';
    }
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout title="Track Your Order - MediQuick">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-xl text-gray-600">Enter your order ID to get real-time delivery updates</p>
        </div>

        {/* Tracking Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleTrackOrder} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <label htmlFor="trackingId" className="block text-sm font-medium text-gray-700 mb-2">
                Order ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="trackingId"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your order ID (e.g., ORD123456)"
                />
                <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Tracking...
                </div>
              ) : (
                'Track Order'
              )}
            </button>
          </form>

          {/* Demo Order ID */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Try demo: 
              <button
                onClick={() => setTrackingId('ORD123456')}
                className="ml-1 text-primary-600 hover:text-primary-700 font-medium"
              >
                ORD123456
              </button>
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-red-900">Order Not Found</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Tracking Results */}
        {orderData && (
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Order Timeline */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order Timeline</h2>
                
                <div className="space-y-6">
                  {orderData.timeline.map((step, index) => (
                    <div key={step.status} className="flex items-start space-x-4">
                      
                      {/* Timeline Dot */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed ? getStatusColor(step.status) : 'bg-gray-300'
                        }`}>
                          {step.completed ? (
                            <CheckCircleIcon className="w-6 h-6 text-white" />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-white"></div>
                          )}
                        </div>
                        {index < orderData.timeline.length - 1 && (
                          <div className={`w-0.5 h-12 mt-2 ${
                            step.completed ? 'bg-gray-300' : 'bg-gray-200'
                          }`}></div>
                        )}
                      </div>

                      {/* Timeline Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <h3 className={`font-semibold ${
                            step.current ? 'text-primary-600' : step.completed ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {step.title}
                          </h3>
                          {step.current && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                              Current Status
                            </span>
                          )}
                        </div>
                        <p className={`text-sm mt-1 ${
                          step.completed ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {step.description}
                        </p>
                        {step.timestamp && (
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            {formatDateTime(step.timestamp)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Details Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Delivery Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Delivery Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <TruckIcon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Expected Delivery</span>
                    </div>
                    <p className="text-primary-600 font-semibold">
                      {formatDateTime(orderData.expectedDelivery)}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPinIcon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Delivery Address</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {orderData.deliveryAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Person */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Delivery Partner</h3>
                
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {orderData.deliveryPerson.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{orderData.deliveryPerson.name}</p>
                    <p className="text-sm text-gray-600">Delivery Partner</p>
                  </div>
                </div>

                <a
                  href={`tel:${orderData.deliveryPerson.phone}`}
                  className="flex items-center justify-center space-x-2 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <PhoneIcon className="w-5 h-5" />
                  <span>Call Delivery Partner</span>
                </a>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">{orderData.orderId}</span>
                  </div>
                  
                  {orderData.medicines.map((medicine, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {medicine.name} (x{medicine.quantity})
                      </span>
                      <span>₹{medicine.price}</span>
                    </div>
                  ))}
                  
                  <hr />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary-600">₹{orderData.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Need Help with Your Order?</h3>
          <p className="text-gray-600 mb-6">
            If you have any questions about your delivery, our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/faq"
              className="inline-flex items-center px-6 py-3 border border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
            >
              View FAQ
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}