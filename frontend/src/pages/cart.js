import { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
  const { cartItems, updateCartItem, removeFromCart, getCartTotal, getCartItemsCount, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    setLoading(true);
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating cart item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setLoading(true);
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Error removing cart item:', error);
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = getCartTotal();
  const itemsCount = getCartItemsCount();

  if (cartItems.length === 0) {
    return (
      <Layout title="Shopping Cart - MediQuick">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h6m-6 0a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some medicines to get started</p>
            <Link
              href="/medicines"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Start Shopping
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Shopping Cart - MediQuick">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {itemsCount} {itemsCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item._id} className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
                
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={item.medicine?.image || '/images/medicine-placeholder.jpg'}
                    alt={item.medicine?.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.medicine?.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.medicine?.brand}
                  </p>
                  <p className="text-lg font-bold text-primary-600">
                    ₹{item.medicine?.price}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    disabled={loading}
                    className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  
                  <span className="w-12 text-center font-semibold">
                    {item.quantity}
                  </span>
                  
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    disabled={loading}
                    className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  disabled={loading}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">₹{cartTotal}</span>
                </div>
              </div>

              {isAuthenticated ? (
                <button className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                  Proceed to Checkout
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 text-center">
                    Please sign in to proceed with checkout
                  </p>
                  <Link
                    href="/auth/login"
                    className="block w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block w-full border border-primary-600 text-primary-600 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors text-center"
                  >
                    Create Account
                  </Link>
                </div>
              )}

              {/* Continue Shopping */}
              <Link
                href="/medicines"
                className="block w-full text-center mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}