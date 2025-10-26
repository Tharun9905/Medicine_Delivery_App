import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../contexts/CartContext';

export default function PopularMedicines({ medicines }) {
  const { addToCart } = useCart();
  const [loadingItems, setLoadingItems] = useState({});

  const handleAddToCart = async (medicine) => {
    setLoadingItems(prev => ({ ...prev, [medicine._id]: true }));
    try {
      await addToCart(medicine._id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoadingItems(prev => ({ ...prev, [medicine._id]: false }));
    }
  };

  if (!medicines || medicines.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Popular Medicines
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Most purchased medicines by our customers
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {medicines.map((medicine) => (
            <div
              key={medicine._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              <div className="relative">
                <img
                  className="w-full h-48 object-cover"
                  src={medicine.images?.[0] || '/api/placeholder/400/300'}
                  alt={medicine.name}
                  onError={(e) => {
                    e.target.src = '/api/placeholder/400/300';
                  }}
                />
                {medicine.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                    {medicine.discount}% OFF
                  </div>
                )}
                {medicine.isPrescriptionRequired && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs">
                    Rx
                  </div>
                )}
              </div>

              <div className="p-4">
                <Link href={`/medicines/${medicine._id}`}>
                  <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                    {medicine.name}
                  </h3>
                </Link>
                
                <p className="mt-1 text-sm text-gray-500">
                  {medicine.manufacturer}
                </p>

                <div className="mt-2 flex items-center">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{medicine.price}
                  </span>
                  {medicine.mrp > medicine.price && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      ₹{medicine.mrp}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(medicine)}
                  disabled={loadingItems[medicine._id] || medicine.stock === 0}
                  className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loadingItems[medicine._id] ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Adding...
                    </div>
                  ) : medicine.stock === 0 ? (
                    'Out of Stock'
                  ) : (
                    'Add to Cart'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/medicines"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            View All Medicines
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}