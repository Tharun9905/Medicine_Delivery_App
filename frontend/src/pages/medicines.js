import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/common/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import medicineService from '../services/medicine.service';

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const { category, featured, popular } = router.query;

  useEffect(() => {
    fetchMedicines();
  }, [selectedCategory, sortBy, currentPage, category, featured, popular]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        sortBy,
        category: selectedCategory || category,
        featured: featured === 'true',
        popular: popular === 'true'
      };

      const response = await medicineService.getMedicines(params);
      if (response.success) {
        setMedicines(response.medicines);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await medicineService.getCategories();
      if (response.success) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const getPageTitle = () => {
    if (featured === 'true') return 'Featured Medicines';
    if (popular === 'true') return 'Popular Medicines';
    if (category) {
      const cat = categories.find(c => c._id === category);
      return cat ? `${cat.name} Medicines` : 'Medicines';
    }
    return 'All Medicines';
  };

  return (
    <Layout title={`${getPageTitle()} - MediQuick`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {getPageTitle()}
          </h1>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="popularity">Sort by Popularity</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {/* Medicines Grid */}
        {!loading && (
          <>
            {medicines.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {medicines.map(medicine => (
                  <div key={medicine._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-w-1 aspect-h-1">
                      <img
                        src={medicine.image || '/images/medicine-placeholder.jpg'}
                        alt={medicine.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {medicine.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {medicine.brand}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-600">
                          ₹{medicine.price}
                        </span>
                        <button className="bg-primary-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-primary-700 transition-colors">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No medicines found</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}