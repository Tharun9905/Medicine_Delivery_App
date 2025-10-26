import { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function OrdersPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // TODO: Implement order service API call
      // const response = await orderService.getUserOrders();
      // setOrders(response.orders || []);
      setOrders([]); // Temporary empty state
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading) {
    return (
      <Layout title="My Orders - MediQuick">
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
    <Layout title="My Orders - MediQuick">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your medicine orders</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {/* Orders List */}
        {!loading && (
          <>
            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                    
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3 mb-4">
                      {order.items.map(item => (
                        <div key={item._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={item.medicine.image || '/images/medicine-placeholder.jpg'}
                            alt={item.medicine.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.medicine.name}</h4>
                            <p className="text-sm text-gray-600">{item.medicine.brand}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{item.price}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-bold text-gray-900">
                          Total: ₹{order.totalAmount}
                        </span>
                        {order.deliveryTime && (
                          <span className="text-sm text-gray-600">
                            Estimated delivery: {new Date(order.deliveryTime).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="mt-3 sm:mt-0 space-x-2">
                        <button className="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                          Track Order
                        </button>
                        {order.status === 'delivered' && (
                          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                            Reorder
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg className="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">No orders yet</h3>
                <p className="text-gray-600 mb-8">Start shopping to see your order history here</p>
                <button
                  onClick={() => router.push('/medicines')}
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Start Shopping
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

        {/* Order Filters/Search - Future Enhancement */}
        {orders.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Need help with an order? <a href="/contact" className="text-primary-600 hover:text-primary-700">Contact us</a>
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}