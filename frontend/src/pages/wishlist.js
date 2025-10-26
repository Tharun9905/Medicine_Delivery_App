import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Layout from '../components/common/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Wishlist() {
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Mock wishlist data - In real implementation, this would come from API
  const mockWishlistItems = [
    {
      _id: '1',
      name: 'Paracetamol 500mg',
      brand: 'Crocin',
      price: 25.50,
      originalPrice: 30.00,
      image: '/api/placeholder/200/200',
      category: 'Pain Relief',
      inStock: true,
      prescription: false
    },
    {
      _id: '2',
      name: 'Vitamin D3 Capsules',
      brand: 'Uprise D3',
      price: 180.00,
      originalPrice: 220.00,
      image: '/api/placeholder/200/200',
      category: 'Vitamins',
      inStock: true,
      prescription: false
    },
    {
      _id: '3',
      name: 'Multivitamin Tablets',
      brand: 'Revital H',
      price: 450.00,
      originalPrice: 600.00,
      image: '/api/placeholder/200/200',
      category: 'Vitamins',
      inStock: false,
      prescription: false
    }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      // Mock API call - In real implementation, fetch from backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWishlistItems(mockWishlistItems);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId) => {
    try {
      setActionLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setWishlistItems(prev => prev.filter(item => item._id !== itemId));
      toast.success('Item removed from wishlist');
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      toast.error('Failed to remove item');
    } finally {
      setActionLoading(false);
    }
  };

  const moveToCart = async (item) => {
    try {
      setActionLoading(true);
      // Add to cart
      await addToCart(item._id, 1);
      
      // Remove from wishlist
      await removeFromWishlist(item._id);
      
      toast.success('Item moved to cart');
    } catch (error) {
      console.error('Failed to move to cart:', error);
      toast.error('Failed to move item to cart');
    } finally {
      setActionLoading(false);
    }
  };

  const calculateDiscount = (original, current) => {
    return Math.round(((original - current) / original) * 100);
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-8">
            Please sign in to view and manage your wishlist items.
          </p>
          <Link
            href="/auth/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Sign In
          </Link>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mb-8"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-48 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="flex space-x-3">
                    <div className="h-10 bg-gray-300 rounded flex-1"></div>
                    <div className="h-10 bg-gray-300 rounded w-10"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="text-6xl mb-6">💝</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h1>
          <p className="text-gray-600 mb-8">
            Save items you love by clicking the heart icon. They'll appear here for easy access.
          </p>
          <Link
            href="/medicines"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Browse Medicines
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-2">
              {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <button
            onClick={loadWishlist}
            className="text-blue-600 hover:text-blue-700 font-medium"
            disabled={loading}
          >
            🔄 Refresh
          </button>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Product Image */}
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x200?text=Medicine';
                  }}
                />
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Out of Stock
                    </span>
                  </div>
                )}
                {item.originalPrice > item.price && (
                  <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
                    {calculateDiscount(item.originalPrice, item.price)}% OFF
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4">
                <div className="mb-3">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {item.category}
                  </span>
                  <h3 className="font-semibold text-gray-900 mt-1">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.brand}</p>
                </div>

                <div className="mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                    {item.originalPrice > item.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{item.originalPrice}
                      </span>
                    )}
                  </div>
                  {item.prescription && (
                    <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded mt-1">
                      Prescription Required
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => moveToCart(item)}
                    disabled={!item.inStock || actionLoading}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                  >
                    {!item.inStock ? 'Out of Stock' : 'Move to Cart'}
                  </button>
                  
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    disabled={actionLoading}
                    className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 hover:text-red-600 transition-colors flex items-center justify-center"
                    title="Remove from wishlist"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions Footer */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Want to add more items to your wishlist?
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/medicines"
              className="bg-white text-gray-700 border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Browse Medicines
            </Link>
            <Link
              href="/categories"
              className="bg-white text-gray-700 border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Shop by Category
            </Link>
            <Link
              href="/offers"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View Offers
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}