import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken();
        const userData = authService.getCurrentUser();

        if (token && userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (phoneNumber, otp) => {
    try {
      const response = await authService.verifyOTP(phoneNumber, otp);
      if (response.success) {
        setUser(response.user);
        toast.success('Login successful!');
        return response;
      }
      throw new Error(response.message);
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        toast.success('Registration successful! Please verify your OTP.');
      }
      return response;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = async (userData) => {
    try {
      const response = await authService.updateProfile(userData);
      if (response.success) {
        setUser(response.user);
        toast.success('Profile updated successfully');
      }
      return response;
    } catch (error) {
      toast.error(error.message || 'Profile update failed');
      throw error;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};