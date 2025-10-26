import { useState } from 'react';
import Layout from '../components/common/Layout';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import {
  QuestionMarkCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ShieldCheckIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

const helpCategories = [
  {
    title: 'Orders & Delivery',
    icon: TruckIcon,
    topics: [
      'How to place an order',
      'Delivery time and charges',
      'Order tracking',
      'Cancellation policy',
      'Order modifications'
    ]
  },
  {
    title: 'Prescriptions',
    icon: ShieldCheckIcon,
    topics: [
      'How to upload prescription',
      'Prescription verification process',
      'Accepted prescription formats',
      'Prescription validity',
      'Multiple prescriptions'
    ]
  },
  {
    title: 'Account & Payments',
    icon: QuestionMarkCircleIcon,
    topics: [
      'Creating an account',
      'Payment methods',
      'Refund process',
      'Wallet and cashback',
      'Account security'
    ]
  }
];

const faqs = [
  {
    question: 'How quickly will my medicines be delivered?',
    answer: 'We deliver medicines within 2-4 hours in metro cities and within 24 hours in other areas. Emergency medicines are prioritized for faster delivery.'
  },
  {
    question: 'Are the medicines genuine?',
    answer: 'Yes, we source all medicines directly from licensed distributors and manufacturers. All products are authentic and stored in proper conditions.'
  },
  {
    question: 'Can I return medicines if I ordered wrong items?',
    answer: 'Due to safety regulations, medicines cannot be returned once delivered. However, you can contact our support team if there was an error from our side.'
  },
  {
    question: 'How do I upload my prescription?',
    answer: 'You can upload your prescription by going to the "Upload Prescription" section and taking a clear photo or uploading an image file. Our pharmacist will verify it within 30 minutes.'
  }
];

export default function HelpPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(0);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <Layout title="Help Center - MediQuick">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
          <p className="text-xl text-gray-600 mb-8">Find answers to common questions or get in touch with our support team</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <QuestionMarkCircleIcon className="w-6 h-6 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Help Categories */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Help Topics</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {helpCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(index)}
                    className={`p-6 rounded-lg border text-left transition-colors ${
                      selectedCategory === index
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-8 h-8 text-primary-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">{category.title}</h3>
                    <p className="text-sm text-gray-600">{category.topics.length} topics</p>
                  </button>
                );
              })}
            </div>

            {/* Category Topics */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {helpCategories[selectedCategory].title}
              </h3>
              <div className="space-y-3">
                {helpCategories[selectedCategory].topics.map((topic, index) => (
                  <div key={index} className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <QuestionMarkCircleIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-4 py-3 text-left font-medium text-gray-900 hover:bg-gray-50 flex justify-between items-center"
                    >
                      {faq.question}
                      {expandedFaq === index ? (
                        <ChevronUpIcon className="w-5 h-5" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <div className="px-4 pb-3 text-gray-600">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Need More Help?</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-primary-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Live Chat</h4>
                    <p className="text-sm text-gray-600">Chat with our support team</p>
                    <p className="text-xs text-green-600 mt-1">● Online now</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <PhoneIcon className="w-6 h-6 text-primary-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Call Us</h4>
                    <p className="text-sm text-gray-600">+91 1800-XXX-XXXX</p>
                    <p className="text-xs text-gray-500 mt-1">24/7 Support</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <EnvelopeIcon className="w-6 h-6 text-primary-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Email Support</h4>
                    <p className="text-sm text-gray-600">support@mediquick.com</p>
                    <p className="text-xs text-gray-500 mt-1">Response within 2 hours</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <ClockIcon className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Support Hours</span>
                </div>
                <p className="text-sm text-blue-800">24/7 for emergency medicines</p>
                <p className="text-sm text-blue-800">9 AM - 9 PM for general support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}