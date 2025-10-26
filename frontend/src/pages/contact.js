import { useState } from 'react';
import Layout from '../components/common/Layout';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Layout title="Contact Us - MediQuick">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">Get in touch with our support team. We're here to help!</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="order-inquiry">Order Inquiry</option>
                      <option value="prescription-help">Prescription Help</option>
                      <option value="payment-issue">Payment Issue</option>
                      <option value="delivery-question">Delivery Question</option>
                      <option value="technical-support">Technical Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Describe your question or concern in detail..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Quick Contact */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Instant Help</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-green-900">Live Chat</h4>
                    <p className="text-sm text-green-700">Average response: 30 seconds</p>
                    <p className="text-xs text-green-600 mt-1">● Available now</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <PhoneIcon className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-blue-900">Emergency Hotline</h4>
                    <p className="text-lg font-semibold text-blue-700">1800-MEDIQUICK</p>
                    <p className="text-xs text-blue-600 mt-1">24/7 for urgent medicine needs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <PhoneIcon className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Customer Support</p>
                    <p className="text-gray-600">+91 1800-XXX-XXXX</p>
                    <p className="text-sm text-gray-500">Mon-Fri: 9AM-9PM, Sat-Sun: 10AM-6PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <EnvelopeIcon className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Email Support</p>
                    <p className="text-gray-600">support@mediquick.com</p>
                    <p className="text-sm text-gray-500">Response within 2 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPinIcon className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Head Office</p>
                    <p className="text-gray-600">
                      123 Healthcare Street<br />
                      Medical District<br />
                      Mumbai, Maharashtra 400001
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <ClockIcon className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Business Hours</p>
                    <p className="text-gray-600">Mon-Sun: 24/7 Medicine Delivery</p>
                    <p className="text-sm text-gray-500">Support: 9AM-9PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Notice */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-900 mb-2">Medical Emergency?</h4>
              <p className="text-sm text-red-700 mb-3">
                For urgent medical situations, please contact emergency services or visit the nearest hospital immediately.
              </p>
              <div className="flex space-x-2 text-sm">
                <span className="text-red-900 font-medium">Emergency:</span>
                <span className="text-red-700">102 / 108</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}