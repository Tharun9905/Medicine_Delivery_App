import { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import medicineService from '../services/medicine.service';
import Link from 'next/link';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await medicineService.getCategories();
      if (response.success) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Categories - MediQuick">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Medicine Categories
          </h1>
          <p className="text-gray-600">
            Browse medicines by category to find what you need quickly
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {/* Categories Grid */}
        {!loading && (
          <>
            {categories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map(category => (
                  <Link
                    key={category._id}
                    href={`/medicines?category=${category._id}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    <div className="aspect-w-16 aspect-h-10">
                      <img
                        src={category.image || '/images/category-placeholder.jpg'}
                        alt={category.name}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {category.medicineCount || 0} medicines
                        </span>
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-gray-500 text-lg">No categories found</p>
                <p className="text-gray-400">Categories will appear here once they are added</p>
              </div>
            )}
          </>
        )}

        {/* Popular Categories Section */}
        {categories.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Popular Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(0, 8).map(category => (
                <Link
                  key={`popular-${category._id}`}
                  href={`/medicines?category=${category._id}`}
                  className="bg-primary-50 rounded-lg p-4 text-center hover:bg-primary-100 transition-colors group"
                >
                  <div className="w-12 h-12 bg-primary-600 rounded-full mx-auto mb-3 flex items-center justify-center group-hover:bg-primary-700 transition-colors">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}