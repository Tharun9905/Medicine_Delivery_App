import React from 'react';
import Layout from '../components/common/Layout';

export default function LabTestsPage() {
  return (
    <Layout title="Lab Tests - MediQuick">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="mb-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-16 h-16 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-yellow-800 mb-2">Lab Tests Feature Coming Soon</h1>
              <p className="text-yellow-700">
                We're working hard to bring you comprehensive lab testing services. This feature will be available in our next update.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-4">What's Coming</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-blue-900">Home Sample Collection</h3>
                    <p className="text-sm text-blue-700">Convenient sample pickup from your home</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-blue-900">NABL Certified Labs</h3>
                    <p className="text-sm text-blue-700">Accurate results from certified laboratories</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-blue-900">Quick Reports</h3>
                    <p className="text-sm text-blue-700">Get results within 24-48 hours</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Need Lab Tests Now?</h2>
              <p className="text-gray-600 mb-4">
                Meanwhile, you can continue to order medicines and upload prescriptions for your medical needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/medicines"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Medicines
                </a>
                <a
                  href="/upload-prescription"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Upload Prescription
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
//   const [labTests, setLabTests] = useState([]);
//   const [filteredTests, setFilteredTests] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     search: '',
//     category: '',
//     priceRange: '',
//     sampleType: '',
//     homeCollection: false,
//     fastingRequired: false
//   });
//   const [selectedTests, setSelectedTests] = useState([]);
//   const [showCart, setShowCart] = useState(false);

//   useEffect(() => {
//     fetchLabTests();
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [labTests, filters]);

//   const fetchLabTests = async () => {
//     try {
//       setLoading(true);
//       // TODO: Replace with actual API call
//       // const response = await labTestService.getLabTests();
      
//       // Mock data for now
//       const mockTests = [
//         {
//           _id: '1',
//           name: 'Complete Blood Count (CBC)',
//           category: 'Blood Tests',
//           price: 350,
//           originalPrice: 500,
//           discount: 30,
//           description: 'Complete blood count test to check overall health and detect various disorders',
//           sampleType: 'Blood',
//           fasting: false,
//           homeCollection: true,
//           reportTime: '24 hours',
//           preparation: 'No special preparation required',
//           isPopular: true,
//           isFeatured: false,
//           parametersCount: 22
//         },
//         {
//           _id: '2',
//           name: 'Lipid Profile',
//           category: 'Heart Health',
//           price: 450,
//           originalPrice: 600,
//           discount: 25,
//           description: 'Measures cholesterol and triglycerides to assess heart disease risk',
//           sampleType: 'Blood',
//           fasting: true,
//           homeCollection: true,
//           reportTime: '24 hours',
//           preparation: '12-14 hours fasting required',
//           isPopular: true,
//           isFeatured: true,
//           parametersCount: 8
//         },
//         {
//           _id: '3',
//           name: 'Thyroid Profile (T3, T4, TSH)',
//           category: 'Hormone Tests',
//           price: 600,
//           originalPrice: 800,
//           discount: 25,
//           description: 'Complete thyroid function test including T3, T4, and TSH levels',
//           sampleType: 'Blood',
//           fasting: false,
//           homeCollection: true,
//           reportTime: '48 hours',
//           preparation: 'No special preparation required',
//           isPopular: false,
//           isFeatured: true,
//           parametersCount: 3
//         },
//         {
//           _id: '4',
//           name: 'HbA1c (Diabetes)',
//           category: 'Diabetes',
//           price: 400,
//           originalPrice: 550,
//           discount: 27,
//           description: 'Average blood sugar levels over the past 2-3 months',
//           sampleType: 'Blood',
//           fasting: false,
//           homeCollection: true,
//           reportTime: '24 hours',
//           preparation: 'No fasting required',
//           isPopular: true,
//           isFeatured: false,
//           parametersCount: 1
//         },
//         {
//           _id: '5',
//           name: 'Vitamin D Total',
//           category: 'Vitamin Tests',
//           price: 800,
//           originalPrice: 1200,
//           discount: 33,
//           description: 'Measures vitamin D levels to assess bone health and immunity',
//           sampleType: 'Blood',
//           fasting: false,
//           homeCollection: true,
//           reportTime: '72 hours',
//           preparation: 'No special preparation required',
//           isPopular: false,
//           isFeatured: false,
//           parametersCount: 1
//         },
//         {
//           _id: '6',
//           name: 'Urine Complete Examination',
//           category: 'Urine Tests',
//           price: 200,
//           originalPrice: 300,
//           discount: 33,
//           description: 'Complete urine analysis to detect urinary tract infections and kidney problems',
//           sampleType: 'Urine',
//           fasting: false,
//           homeCollection: false,
//           reportTime: '24 hours',
//           preparation: 'Collect first morning urine sample',
//           isPopular: false,
//           isFeatured: false,
//           parametersCount: 15
//         }
//       ];

//       setLabTests(mockTests);
//     } catch (error) {
//       console.error('Error fetching lab tests:', error);
//       toast.error('Failed to load lab tests');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       // TODO: Replace with actual API call
//       // const response = await labTestService.getCategories();
      
//       // Mock categories for now
//       const mockCategories = [
//         'Blood Tests',
//         'Heart Health', 
//         'Hormone Tests',
//         'Diabetes',
//         'Vitamin Tests',
//         'Urine Tests',
//         'Liver Function',
//         'Kidney Function'
//       ];
      
//       setCategories(mockCategories);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = [...labTests];

//     // Search filter
//     if (filters.search) {
//       filtered = filtered.filter(test =>
//         test.name.toLowerCase().includes(filters.search.toLowerCase()) ||
//         test.description.toLowerCase().includes(filters.search.toLowerCase()) ||
//         test.category.toLowerCase().includes(filters.search.toLowerCase())
//       );
//     }

//     // Category filter
//     if (filters.category) {
//       filtered = filtered.filter(test => test.category === filters.category);
//     }

//     // Price range filter
//     if (filters.priceRange) {
//       const [min, max] = filters.priceRange.split('-').map(Number);
//       filtered = filtered.filter(test => {
//         if (max) {
//           return test.price >= min && test.price <= max;
//         } else {
//           return test.price >= min;
//         }
//       });
//     }

//     // Sample type filter
//     if (filters.sampleType) {
//       filtered = filtered.filter(test => test.sampleType === filters.sampleType);
//     }

//     // Home collection filter
//     if (filters.homeCollection) {
//       filtered = filtered.filter(test => test.homeCollection);
//     }

//     // Fasting required filter
//     if (filters.fastingRequired) {
//       filtered = filtered.filter(test => test.fasting);
//     }

//     setFilteredTests(filtered);
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [key]: value
//     }));
//   };

//   const clearFilters = () => {
//     setFilters({
//       search: '',
//       category: '',
//       priceRange: '',
//       sampleType: '',
//       homeCollection: false,
//       fastingRequired: false
//     });
//   };

//   const addToCart = (test) => {
//     setSelectedTests(prev => {
//       const exists = prev.find(item => item._id === test._id);
//       if (exists) {
//         toast.info('Test already added to cart');
//         return prev;
//       }
      
//       const newCart = [...prev, { ...test, quantity: 1 }];
//       toast.success(`${test.name} added to cart`);
//       return newCart;
//     });
//   };

//   const removeFromCart = (testId) => {
//     setSelectedTests(prev => {
//       const newCart = prev.filter(item => item._id !== testId);
//       toast.success('Test removed from cart');
//       return newCart;
//     });
//   };

//   const getTotalPrice = () => {
//     return selectedTests.reduce((total, test) => total + test.price, 0);
//   };

//   const getTotalOriginalPrice = () => {
//     return selectedTests.reduce((total, test) => total + test.originalPrice, 0);
//   };

//   const getTotalDiscount = () => {
//     return getTotalOriginalPrice() - getTotalPrice();
//   };

//   if (loading) {
//     return (
//       <Layout title="Lab Tests - MediQuick">
//         <div className="flex justify-center items-center min-h-[400px]">
//           <LoadingSpinner size="large" />
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout title="Lab Tests - MediQuick">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-4">Lab Tests</h1>
//           <p className="text-gray-600 mb-6">
//             Book lab tests from the comfort of your home with accurate results and timely reports
//           </p>

//           {/* Quick Stats */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//             <div className="bg-blue-50 rounded-lg p-4">
//               <div className="flex items-center">
//                 <div className="bg-blue-100 rounded-lg p-2">
//                   <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm font-medium text-blue-900">Home Collection</p>
//                   <p className="text-sm text-blue-600">Available for most tests</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-green-50 rounded-lg p-4">
//               <div className="flex items-center">
//                 <div className="bg-green-100 rounded-lg p-2">
//                   <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm font-medium text-green-900">Quick Reports</p>
//                   <p className="text-sm text-green-600">24-72 hours</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-purple-50 rounded-lg p-4">
//               <div className="flex items-center">
//                 <div className="bg-purple-100 rounded-lg p-2">
//                   <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm font-medium text-purple-900">Accurate Results</p>
//                   <p className="text-sm text-purple-600">NABL certified labs</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
//           {/* Filters Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
//                 <button
//                   onClick={clearFilters}
//                   className="text-sm text-primary-600 hover:text-primary-700"
//                 >
//                   Clear All
//                 </button>
//               </div>

//               <div className="space-y-6">
                
//                 {/* Search */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Search Tests
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Search lab tests..."
//                     value={filters.search}
//                     onChange={(e) => handleFilterChange('search', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                   />
//                 </div>

//                 {/* Category */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Category
//                   </label>
//                   <select
//                     value={filters.category}
//                     onChange={(e) => handleFilterChange('category', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                   >
//                     <option value="">All Categories</option>
//                     {categories.map(category => (
//                       <option key={category} value={category}>{category}</option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Price Range */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Price Range
//                   </label>
//                   <select
//                     value={filters.priceRange}
//                     onChange={(e) => handleFilterChange('priceRange', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                   >
//                     <option value="">All Prices</option>
//                     <option value="0-500">₹0 - ₹500</option>
//                     <option value="500-1000">₹500 - ₹1000</option>
//                     <option value="1000-2000">₹1000 - ₹2000</option>
//                     <option value="2000">₹2000+</option>
//                   </select>
//                 </div>

//                 {/* Sample Type */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Sample Type
//                   </label>
//                   <select
//                     value={filters.sampleType}
//                     onChange={(e) => handleFilterChange('sampleType', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                   >
//                     <option value="">All Types</option>
//                     <option value="Blood">Blood</option>
//                     <option value="Urine">Urine</option>
//                     <option value="Stool">Stool</option>
//                     <option value="Saliva">Saliva</option>
//                   </select>
//                 </div>

//                 {/* Additional Filters */}
//                 <div className="space-y-3">
//                   <label className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={filters.homeCollection}
//                       onChange={(e) => handleFilterChange('homeCollection', e.target.checked)}
//                       className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
//                     />
//                     <span className="ml-2 text-sm text-gray-700">Home Collection Available</span>
//                   </label>

//                   <label className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={filters.fastingRequired}
//                       onChange={(e) => handleFilterChange('fastingRequired', e.target.checked)}
//                       className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
//                     />
//                     <span className="ml-2 text-sm text-gray-700">Fasting Required</span>
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Tests Grid */}
//           <div className="lg:col-span-3">
//             <div className="flex items-center justify-between mb-6">
//               <p className="text-gray-600">
//                 Showing {filteredTests.length} of {labTests.length} tests
//               </p>
              
//               {selectedTests.length > 0 && (
//                 <button
//                   onClick={() => setShowCart(true)}
//                   className="flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
//                 >
//                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5M7 13l-2.9 0M20 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6" />
//                   </svg>
//                   Cart ({selectedTests.length})
//                 </button>
//               )}
//             </div>

//             {/* Tests Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {filteredTests.map(test => (
//                 <div key={test._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
//                   <div className="p-6">
//                     {/* Test Header */}
//                     <div className="flex items-start justify-between mb-4">
//                       <div className="flex-1">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-1">{test.name}</h3>
//                         <p className="text-sm text-gray-600 mb-2">{test.category}</p>
//                         <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
//                           <span className="flex items-center">
//                             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
//                             </svg>
//                             {test.sampleType}
//                           </span>
//                           <span className="flex items-center">
//                             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                             {test.reportTime}
//                           </span>
//                           <span>{test.parametersCount} parameters</span>
//                         </div>
//                       </div>
                      
//                       {(test.isPopular || test.isFeatured) && (
//                         <div className="flex flex-col space-y-1">
//                           {test.isPopular && (
//                             <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
//                               Popular
//                             </span>
//                           )}
//                           {test.isFeatured && (
//                             <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
//                               Featured
//                             </span>
//                           )}
//                         </div>
//                       )}
//                     </div>

//                     <p className="text-sm text-gray-600 mb-4">{test.description}</p>

//                     {/* Test Features */}
//                     <div className="flex flex-wrap gap-2 mb-4">
//                       {test.homeCollection && (
//                         <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
//                           🏠 Home Collection
//                         </span>
//                       )}
//                       {test.fasting && (
//                         <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
//                           🍽️ Fasting Required
//                         </span>
//                       )}
//                     </div>

//                     {/* Pricing */}
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-2">
//                         <span className="text-2xl font-bold text-gray-900">₹{test.price}</span>
//                         {test.originalPrice > test.price && (
//                           <>
//                             <span className="text-sm text-gray-500 line-through">₹{test.originalPrice}</span>
//                             <span className="text-sm text-green-600 font-medium">{test.discount}% off</span>
//                           </>
//                         )}
//                       </div>

//                       <button
//                         onClick={() => addToCart(test)}
//                         disabled={selectedTests.some(item => item._id === test._id)}
//                         className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//                       >
//                         {selectedTests.some(item => item._id === test._id) ? 'Added' : 'Add to Cart'}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {filteredTests.length === 0 && (
//               <div className="text-center py-16">
//                 <svg className="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
//                 </svg>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-4">No tests found</h3>
//                 <p className="text-gray-600 mb-8">Try adjusting your filters to find more tests</p>
//                 <button
//                   onClick={clearFilters}
//                   className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
//                 >
//                   Clear Filters
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Cart Modal */}
//         {showCart && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-xl font-semibold text-gray-900">
//                     Selected Tests ({selectedTests.length})
//                   </h3>
//                   <button
//                     onClick={() => setShowCart(false)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>

//                 <div className="space-y-4 mb-6">
//                   {selectedTests.map(test => (
//                     <div key={test._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//                       <div className="flex-1">
//                         <h4 className="font-medium text-gray-900">{test.name}</h4>
//                         <p className="text-sm text-gray-600">{test.category}</p>
//                         <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
//                           <span>{test.sampleType}</span>
//                           <span>{test.reportTime}</span>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-4">
//                         <div className="text-right">
//                           <p className="font-bold text-gray-900">₹{test.price}</p>
//                           {test.originalPrice > test.price && (
//                             <p className="text-sm text-gray-500 line-through">₹{test.originalPrice}</p>
//                           )}
//                         </div>
//                         <button
//                           onClick={() => removeFromCart(test._id)}
//                           className="text-red-600 hover:text-red-700"
//                         >
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                           </svg>
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Price Summary */}
//                 <div className="border-t border-gray-200 pt-4 mb-6">
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span>Original Price</span>
//                       <span>₹{getTotalOriginalPrice()}</span>
//                     </div>
//                     <div className="flex justify-between text-green-600">
//                       <span>Discount</span>
//                       <span>-₹{getTotalDiscount()}</span>
//                     </div>
//                     <div className="flex justify-between text-lg font-bold">
//                       <span>Total Amount</span>
//                       <span>₹{getTotalPrice()}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <button
//                   onClick={() => {
//                     toast.success('Proceeding to checkout...');
//                     setShowCart(false);
//                   }}
//                   className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
//                 >
//                   Book Tests - ₹{getTotalPrice()}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// }