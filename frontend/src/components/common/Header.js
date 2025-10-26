import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { MagnifyingGlassIcon, ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemsCount } = useCart();
  const router = useRouter();
  const searchRef = useRef();

  const cartItemsCount = getCartItemsCount();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => setIsMenuOpen(false);
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router.events]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-primary-600">MediQuick</h1>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <input
                ref={searchRef}
                type="text"
                placeholder="Search medicines, brands, cate..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
              </div>
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-600 hover:text-primary-700"
              >
                <span className="sr-only">Search</span>
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Lab Tests */}
            <Link href="/lab-tests" className="px-3 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Lab Tests
            </Link>

            {/* Consult Doctor */}
            <Link href="/consult-doctor" className="px-3 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Consult Doctor
            </Link>

            {/* Offers */}
            {/* <Link href="/offers" className="px-3 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Offers
            </Link> */}

            {/* Upload Prescription */}
            <Link href="/upload-prescription" className="px-3 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Upload Prescription
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <ShoppingCartIcon className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors p-2"
                >
                  <UserIcon className="w-6 h-6" />
                  <span className="hidden lg:block text-sm font-medium">
                    {user?.name || user?.phoneNumber}
                  </span>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Profile
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Orders
                    </Link>
                    <Link href="/prescriptions" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Prescriptions
                    </Link>
                    <Link href="/addresses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Saved Addresses
                    </Link>
                    <Link href="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Wishlist
                    </Link>
                    <Link href="/test-features" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Test Features
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-primary-600 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile icons: cart then menu (cart placed to the right, before menu button) */}
          <div className="md:hidden flex items-center space-x-2">
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <ShoppingCartIcon className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search medicines..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </form>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <Link 
                href="/cart" 
                className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <span>Cart</span>
                {cartItemsCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              <Link href="/consult-doctor" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                Consult Doctor
              </Link>
              {/* <Link href="/offers" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                Offers
              </Link> */}
              <Link href="/upload-prescription" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                Upload Prescription
              </Link>
              <Link href="/test-features" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                Test Features
              </Link>

              {isAuthenticated ? (
                <>
                  <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                    My Profile
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                    My Orders
                  </Link>
                  <Link href="/prescriptions" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                    Prescriptions
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="space-y-2 px-4">
                  <Link
                    href="/auth/login"
                    className="block w-full text-center py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block w-full text-center py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}