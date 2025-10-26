import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../components/common/Layout';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'order', label: 'Order Related' },
    { value: 'delivery', label: 'Delivery Issue' },
    { value: 'payment', label: 'Payment Issue' },
    { value: 'consultation', label: 'Doctor Consultation' },
    { value: 'prescription', label: 'Prescription Issue' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'feedback', label: 'Feedback/Suggestion' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Mock API call - In real implementation, this would send to server
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Your message has been sent successfully! We\'ll get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general'
      });
      
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Contact form error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're here to help! Reach out to us for any questions, concerns, or support needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h2>
            
            {/* Contact Methods */}
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📞</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Phone Support</h3>
                  <p className="text-gray-600">Available 24/7 for emergencies</p>
                  <p className="text-blue-600 font-medium">+91 7976388117</p>
                  <p className="text-sm text-gray-500">Toll-free for all customers</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📧</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email Support</h3>
                  <p className="text-gray-600">Get detailed assistance</p>
                  <p className="text-blue-600 font-medium">support@mediquick.com</p>
                  <p className="text-sm text-gray-500">Response within 2-4 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💬</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Live Chat</h3>
                  <p className="text-gray-600">Instant support available</p>
                  <p className="text-blue-600 font-medium">Chat with us now</p>
                  <p className="text-sm text-gray-500">Available on app and website</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📍</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Office Address</h3>
                  <p className="text-gray-600">MediQuick Healthcare Pvt. Ltd.</p>
                  <p className="text-gray-600">
                    123 Healthcare Plaza,<br />
                    Medical District, New Delhi - 110001<br />
                    India
                  </p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Business Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Medicine Delivery</span>
                  <span className="text-gray-900 font-medium">24/7 Available</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Doctor Consultation</span>
                  <span className="text-gray-900 font-medium">24/7 Available</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lab Sample Collection</span>
                  <span className="text-gray-900 font-medium">6:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Support</span>
                  <span className="text-gray-900 font-medium">24/7 Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief subject of your message"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please describe your inquiry in detail..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-3">How fast is medicine delivery?</h3>
                <p className="text-gray-600 text-sm">
                  We deliver medicines within 20-30 minutes in most areas. Emergency medicines 
                  can be delivered even faster.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Are the medicines authentic?</h3>
                <p className="text-gray-600 text-sm">
                  Yes, all medicines are sourced directly from licensed manufacturers and 
                  distributors. We maintain proper storage conditions.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Do I need a prescription?</h3>
                <p className="text-gray-600 text-sm">
                  For prescription medicines, yes. You can upload a photo of your prescription 
                  or consult with our doctors.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-3">What payment methods do you accept?</h3>
                <p className="text-gray-600 text-sm">
                  We accept all major payment methods including credit/debit cards, UPI, 
                  net banking, and cash on delivery.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Can I return medicines?</h3>
                <p className="text-gray-600 text-sm">
                  Due to safety regulations, medicines cannot be returned. However, we have 
                  a strict quality check process before delivery.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-3">How do I track my order?</h3>
                <p className="text-gray-600 text-sm">
                  You'll receive real-time updates via SMS and app notifications. You can 
                  also track your order in the app.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-16 bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">🚨</div>
          <h2 className="text-2xl font-bold text-red-900 mb-4">Emergency Support</h2>
          <p className="text-red-700 mb-4">
            For medical emergencies requiring immediate assistance, please call:
          </p>
          <div className="text-3xl font-bold text-red-900 mb-4">
            <a href="tel:+917976388117" className="hover:underline">+91 7976388117</a>
          </div>
          <p className="text-sm text-red-600">
            Available 24/7 • Priority response for emergency medicine needs
          </p>
        </div>
      </div>
    </Layout>
  );
}