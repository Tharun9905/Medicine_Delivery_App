import { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import HeroSection from '../components/common/HeroSection';
import CategoryGrid from '../components/medicine/CategoryGrid';
import PopularMedicines from '../components/medicine/PopularMedicines';
import FeaturedMedicines from '../components/medicine/FeaturedMedicines';
import medicineService from '../services/medicine.service';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [popularMedicines, setPopularMedicines] = useState([]);
  const [featuredMedicines, setFeaturedMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, popularRes, featuredRes] = await Promise.all([
          medicineService.getCategories(),
          medicineService.getPopularMedicines(),
          medicineService.getFeaturedMedicines()
        ]);

        if (categoriesRes.success) {
          setCategories(categoriesRes.categories.slice(0, 8));
        }
        if (popularRes.success) {
          setPopularMedicines(popularRes.medicines);
        }
        if (featuredRes.success) {
          setFeaturedMedicines(featuredRes.medicines);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome Message for Logged in Users */}
        {user && (
          <div className="mb-8 bg-primary-50 border border-primary-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-primary-800">
              Welcome back, {user.name || 'User'}! 👋
            </h2>
            <p className="text-primary-600 mt-1">
              Ready to order your medicines? We deliver in 24 Hours.
            </p>
          </div>
        )}

        {/* Categories Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Shop by Category
            </h2>
            <a href="/categories" className="text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </a>
          </div>
          <CategoryGrid categories={categories} loading={loading} />
        </section>

        {/* Featured Medicines */}
        {featuredMedicines.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Featured Medicines
              </h2>
              <a href="/medicines?featured=true" className="text-primary-600 hover:text-primary-700 font-medium">
                View All →
              </a>
            </div>
            <FeaturedMedicines medicines={featuredMedicines} loading={loading} />
          </section>
        )}

        {/* Popular Medicines */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Popular Medicines
            </h2>
            <a href="/medicines?popular=true" className="text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </a>
          </div>
          <PopularMedicines medicines={popularMedicines} loading={loading} />
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">
              Why Choose MediQuick?
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Your health is our priority. We provide genuine medicines with fast delivery and excellent service.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600 transition-colors">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">24-Hours Delivery</h3>
                <p className="text-gray-600">Lightning fast delivery to your doorstep within 24 Hours</p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600 transition-colors">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">100% Genuine</h3>
                <p className="text-gray-600">Only authentic medicines from licensed pharmacies</p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600 transition-colors">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
                <p className="text-gray-600">Competitive prices with exclusive offers and discounts</p>
              </div>
            </div>

            <div className="text-center mt-12">
              <a 
                href="/medicines" 
                className="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                Start Shopping
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Emergency Section */}
        <section className="mt-16 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-red-800">Medical Emergency?</h3>
              <p className="text-red-600">Call our 24/7 helpline: <strong>+91 89041 93463</strong></p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}