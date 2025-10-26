import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/common/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import medicineService from '../services/medicine.service';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchPage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const router = useRouter();
  const { q } = router.query;

  useEffect(() => {
    if (q) {
      setSearchQuery(q);
      searchMedicines(q);
    }
  }, [q, sortBy, currentPage]);

  const searchMedicines = async (query) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const params = {
        search: query,
        page: currentPage,
        limit: 12,
        sortBy
      };

      const response = await medicineService.searchMedicines(params);
      if (response.success) {
        setMedicines(response.medicines);
        setTotalPages(response.totalPages);
        setTotalResults(response.totalCount);
      }
    } catch (error) {
      console.error('Error searching medicines:', error);
      setMedicines([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  return (
    <Layout title={`Search Results - MediQuick`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Search Medicines
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search medicines, brands, categories..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="w-6 h-6 text-gray-400" />
              </div>
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-600 hover:text-primary-700"
              >
                <span className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                  Search
                </span>
              </button>
            </div>
          </form>

          {/* Results Info & Sort */}
          {q && (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-gray-600">
                  {loading ? 'Searching...' : (
                    <>
                      {totalResults > 0 ? (
                        <>Showing {totalResults} result{totalResults !== 1 ? 's' : ''} for <strong>"{q}"</strong></>
                      ) : (
                        <>No results found for <strong>"{q}"</strong></>
                      )}
                    </>
                  )}
                </p>
              </div>
              
              {totalResults > 0 && (
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                  <option value="popularity">Sort by Popularity</option>
                </select>
              )}
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {/* Search Results */}
        {!loading && q && (
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
                      {medicine.category && (
                        <p className="text-xs text-primary-600 mb-2">
                          {medicine.category.name}
                        </p>
                      )}
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
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-gray-500 text-lg mb-2">No medicines found</p>
                <p className="text-gray-400 mb-6">Try searching with different keywords</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Search Tips:</strong></p>
                  <ul className="list-disc list-inside space-y-1 max-w-md mx-auto">
                    <li>Check your spelling</li>
                    <li>Try more general keywords</li>
                    <li>Search by brand name or category</li>
                    <li>Use shorter search terms</li>
                  </ul>
                </div>
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

        {/* No Query State */}
        {!q && (
          <div className="text-center py-16">
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Enter a search term to find medicines</p>
          </div>
        )}
      </div>
    </Layout>
  );
}