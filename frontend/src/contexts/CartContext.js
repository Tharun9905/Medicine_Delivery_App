import React, { createContext, useContext, useState, useEffect } from 'react';
import cartService from '../services/cart.service';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      const response = await cartService.getCart();
      if (response.success) {
        setCart(response.cart);
      }
    } catch (error) {
      console.error('Fetch cart error:', error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (medicineId, quantity = 1) => {
    try {
      const response = await cartService.addToCart(medicineId, quantity);
      if (response.success) {
        setCart(response.cart);
        toast.success('Item added to cart');
        return response;
      }
    } catch (error) {
      toast.error(error.message || 'Failed to add item to cart');
      throw error;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await cartService.updateCartItem(itemId, quantity);
      if (response.success) {
        setCart(response.cart);
        toast.success('Cart updated');
        return response;
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update cart');
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await cartService.removeFromCart(itemId);
      if (response.success) {
        setCart(response.cart);
        toast.success('Item removed from cart');
        return response;
      }
    } catch (error) {
      toast.error(error.message || 'Failed to remove item');
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const response = await cartService.clearCart();
      if (response.success) {
        setCart(response.cart);
        toast.success('Cart cleared');
        return response;
      }
    } catch (error) {
      toast.error(error.message || 'Failed to clear cart');
      throw error;
    }
  };

  const applyCoupon = async (couponCode) => {
    try {
      const response = await cartService.applyCoupon(couponCode);
      if (response.success) {
        setCart(response.cart);
        toast.success('Coupon applied successfully');
        return response;
      }
    } catch (error) {
      toast.error(error.message || 'Failed to apply coupon');
      throw error;
    }
  };

  const getCartItemsCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart?.pricing?.finalAmount || 0;
  };

  const value = {
    cart,
    cartItems: cart?.items || [],
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    fetchCart,
    getCartItemsCount,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};