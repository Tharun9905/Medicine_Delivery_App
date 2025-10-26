import Layout from '../components/common/Layout';

export default function AboutUs() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About MediQuick
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted healthcare partner delivering quality medicines and healthcare services 
            right to your doorstep, anytime, anywhere.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
                To make quality healthcare accessible to everyone by providing reliable medicine 
                delivery, expert consultations, and comprehensive health services through innovative 
                technology and exceptional care.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Quick & Reliable Medicine Delivery</span>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Expert Doctor Consultations</span>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Comprehensive Lab Testing</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <div className="text-6xl mb-4">🏥</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Healthcare Excellence</h3>
                <p className="text-gray-600">Committed to your health and well-being</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality First</h3>
              <p className="text-gray-600">
                We ensure all medicines are authentic, properly stored, and delivered with care 
                to maintain their efficacy.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Speed & Convenience</h3>
              <p className="text-gray-600">
                Quick delivery within 20-30 minutes, making healthcare accessible when you need it most.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Privacy & Trust</h3>
              <p className="text-gray-600">
                Your health information is secure with us. We maintain complete confidentiality 
                and data protection.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-900 rounded-2xl p-8 md:p-12 text-white mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">50K+</div>
              <div className="text-gray-300">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">100K+</div>
              <div className="text-gray-300">Orders Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">500+</div>
              <div className="text-gray-300">Expert Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">24/7</div>
              <div className="text-gray-300">Available</div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What We Offer</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">💊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Medicine Delivery</h3>
              <p className="text-gray-600 mb-4">
                Quick delivery of prescription and over-the-counter medicines with proper storage and handling.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• 20-min delivery</li>
                <li>• Authentic medicines</li>
                <li>• Prescription verification</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">👩‍⚕️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Doctor Consultation</h3>
              <p className="text-gray-600 mb-4">
                Consult with qualified doctors via video, audio, or chat for various health concerns.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Video/Audio calls</li>
                <li>• Verified doctors</li>
                <li>• Digital prescriptions</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">🧪</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lab Tests</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive lab testing with home sample collection and digital reports.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Home collection</li>
                <li>• Digital reports</li>
                <li>• Expert analysis</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Prescription Upload</h3>
              <p className="text-gray-600 mb-4">
                Upload prescription photos and get medicines delivered without hassle.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Camera capture</li>
                <li>• Pharmacist verification</li>
                <li>• Quick processing</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Health Products</h3>
              <p className="text-gray-600 mb-4">
                Wide range of health and wellness products for complete care.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Vitamins & supplements</li>
                <li>• Personal care</li>
                <li>• Health devices</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-600 mb-4">
                Round-the-clock customer support for all your healthcare needs.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Live chat support</li>
                <li>• Phone assistance</li>
                <li>• Emergency care</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Team</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Our team consists of healthcare professionals, technology experts, and customer service 
            specialists dedicated to providing you with the best healthcare experience.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👨‍⚕️</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Medical Experts</h3>
              <p className="text-gray-600 text-sm">Licensed doctors and pharmacists ensuring quality care</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👨‍💻</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Tech Team</h3>
              <p className="text-gray-600 text-sm">Innovative developers creating seamless user experiences</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Support Team</h3>
              <p className="text-gray-600 text-sm">Dedicated support staff available 24/7 for assistance</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}