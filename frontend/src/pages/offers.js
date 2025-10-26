import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../components/common/Layout';
import { useAuth } from '../contexts/AuthContext';

export default function Offers() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedCode, setCopiedCode] = useState('');

  const offerCategories = [
    { id: 'all', name: 'All Offers', count: 12 },
    { id: 'medicines', name: 'Medicines', count: 5 },
    { id: 'consultation', name: 'Consultation', count: 3 },
    { id: 'lab-tests', name: 'Lab Tests', count: 4 }
  ];

  const offers = [
    {
      id: 1,
      title: 'First Order Special',
      description: 'Get 25% off on your first medicine order',
      discount: '25% OFF',
      code: 'FIRST25',
      category: 'medicines',
      validUntil: '2024-02-28',
      minOrder: 299,
      maxDiscount: 150,
      type: 'percentage',
      banner: 'bg-gradient-to-r from-green-500 to-green-600',
      icon: '🎯'
    },
    {
      id: 2,
      title: 'Free Delivery',
      description: 'Free delivery on orders above ₹499',
      discount: 'FREE DELIVERY',
      code: 'FREEDEL499',
      category: 'medicines',
      validUntil: '2024-03-31',
      minOrder: 499,
      maxDiscount: 40,
      type: 'free_delivery',
      banner: 'bg-gradient-to-r from-blue-500 to-blue-600',
      icon: '🚚'
    },
    {
      id: 3,
      title: 'Doctor Consultation',
      description: 'Flat ₹100 off on first consultation',
      discount: '₹100 OFF',
      code: 'CONSULT100',
      category: 'consultation',
      validUntil: '2024-02-29',
      minOrder: 299,
      maxDiscount: 100,
      type: 'fixed',
      banner: 'bg-gradient-to-r from-purple-500 to-purple-600',
      icon: '👩‍⚕️'
    },
    {
      id: 4,
      title: 'Health Checkup',
      description: '30% off on comprehensive health packages',
      discount: '30% OFF',
      code: 'HEALTH30',
      category: 'lab-tests',
      validUntil: '2024-03-15',
      minOrder: 999,
      maxDiscount: 500,
      type: 'percentage',
      banner: 'bg-gradient-to-r from-red-500 to-red-600',
      icon: '🩺'
    },
    {
      id: 5,
      title: 'Buy 2 Get 1',
      description: 'Buy 2 medicines and get 1 free on selected items',
      discount: 'BUY 2 GET 1',
      code: 'B2G1FREE',
      category: 'medicines',
      validUntil: '2024-02-25',
      minOrder: 199,
      maxDiscount: 200,
      type: 'bogo',
      banner: 'bg-gradient-to-r from-orange-500 to-orange-600',
      icon: '🎁'
    },
    {
      id: 6,
      title: 'Weekend Special',
      description: 'Extra 15% off on weekend orders',
      discount: '15% EXTRA',
      code: 'WEEKEND15',
      category: 'medicines',
      validUntil: '2024-12-31',
      minOrder: 399,
      maxDiscount: 100,
      type: 'percentage',
      banner: 'bg-gradient-to-r from-pink-500 to-pink-600',
      icon: '🎉',
      weekendOnly: true
    },
    {
      id: 7,
      title: 'Lab Tests Combo',
      description: 'Book 3 tests and get 40% discount',
      discount: '40% OFF',
      code: 'LAB3COMBO',
      category: 'lab-tests',
      validUntil: '2024-03-10',
      minOrder: 1299,
      maxDiscount: 800,
      type: 'percentage',
      banner: 'bg-gradient-to-r from-teal-500 to-teal-600',
      icon: '🧪'
    },
    {
      id: 8,
      title: 'Senior Citizen',
      description: 'Special 20% discount for senior citizens (60+)',
      discount: '20% OFF',
      code: 'SENIOR20',
      category: 'medicines',
      validUntil: '2024-12-31',
      minOrder: 199,
      maxDiscount: 200,
      type: 'percentage',
      banner: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      icon: '👴',
      ageRestriction: true
    }
  ];

  const filteredOffers = selectedCategory === 'all' 
    ? offers 
    : offers.filter(offer => offer.category === selectedCategory);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied!`);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const isOfferValid = (offer) => {
    const today = new Date();
    const validUntil = new Date(offer.validUntil);
    
    if (today > validUntil) return false;
    
    if (offer.weekendOnly) {
      const dayOfWeek = today.getDay();
      return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
    }
    
    return true;
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Special Offers & Deals</h1>
          <p className="text-lg text-gray-600">Save more on medicines, consultations, and lab tests</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {offerCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Offers Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 ${
                !isOfferValid(offer) ? 'opacity-60' : ''
              }`}
            >
              {/* Offer Header */}
              <div className={`${offer.banner} p-6 text-white relative`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">{offer.icon}</span>
                      <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
                        {offer.category.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                    <p className="text-sm opacity-90">{offer.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-white bg-opacity-20 px-3 py-1 rounded-lg">
                      <span className="font-bold text-lg">{offer.discount}</span>
                    </div>
                  </div>
                </div>
                
                {!isOfferValid(offer) && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-xs">
                    EXPIRED
                  </div>
                )}
              </div>

              {/* Offer Body */}
              <div className="p-6">
                {/* Coupon Code */}
                <div className="mb-4">
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border-2 border-dashed border-gray-300">
                    <span className="font-mono font-bold text-lg text-gray-800">
                      {offer.code}
                    </span>
                    <button
                      onClick={() => copyToClipboard(offer.code)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        copiedCode === offer.code
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      {copiedCode === offer.code ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Offer Details */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Min Order:</span>
                    <span className="font-medium">₹{offer.minOrder}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Discount:</span>
                    <span className="font-medium">₹{offer.maxDiscount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valid Until:</span>
                    <span className="font-medium">
                      {new Date(offer.validUntil).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Special Conditions */}
                {(offer.weekendOnly || offer.ageRestriction) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <div className="text-xs text-yellow-800">
                      {offer.weekendOnly && <p>• Valid only on weekends</p>}
                      {offer.ageRestriction && <p>• Valid for senior citizens (60+) only</p>}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => toast.success('Redirecting to apply offer...')}
                  disabled={!isOfferValid(offer)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    isOfferValid(offer)
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isOfferValid(offer) ? 'Apply Offer' : 'Offer Expired'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredOffers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No offers available</h3>
            <p className="text-gray-600">Check back later for new deals!</p>
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="mt-12 bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms & Conditions</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <ul className="space-y-2">
                <li>• Offers cannot be combined with other promotions</li>
                <li>• Coupon codes are case-sensitive</li>
                <li>• Valid only for registered users</li>
                <li>• Applicable on MRP of products</li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2">
                <li>• Offers valid for limited time only</li>
                <li>• MediQuick reserves right to modify/cancel offers</li>
                <li>• One coupon per order unless specified</li>
                <li>• Terms apply as per individual offer conditions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}