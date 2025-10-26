import { useState } from 'react';
import Layout from '../components/common/Layout';
import { ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const faqCategories = [
  {
    title: 'Orders & Delivery',
    faqs: [
      {
        question: 'How do I place an order on MediQuick?',
        answer: 'You can place an order by browsing our medicine catalog, adding items to cart, and completing checkout. For prescription medicines, upload your prescription during the ordering process.'
      },
      {
        question: 'What are your delivery charges and timings?',
        answer: 'We offer free delivery for orders above ₹500. For orders below that, delivery charges are ₹50. Standard delivery takes 2-4 hours in metro cities and 24 hours in other areas.'
      },
      {
        question: 'Can I track my order?',
        answer: 'Yes, you can track your order in real-time through your account dashboard or using the tracking link sent to your email/SMS.'
      },
      {
        question: 'Can I modify or cancel my order?',
        answer: 'Orders can be modified or cancelled within 15 minutes of placement. After that, please contact our support team for assistance.'
      },
      {
        question: 'What if I\'m not available during delivery?',
        answer: 'Our delivery partner will try to contact you. If you\'re unavailable, we\'ll attempt delivery later or you can reschedule through customer support.'
      }
    ]
  },
  {
    title: 'Prescriptions',
    faqs: [
      {
        question: 'How do I upload my prescription?',
        answer: 'Click on "Upload Prescription" from the menu, take a clear photo of your prescription, or upload an image file. Ensure the prescription is clearly visible and valid.'
      },
      {
        question: 'What prescription formats do you accept?',
        answer: 'We accept digital prescriptions, scanned copies, and clear photos of physical prescriptions. The prescription should be legible and contain all required details.'
      },
      {
        question: 'How long does prescription verification take?',
        answer: 'Our licensed pharmacists verify prescriptions within 30 minutes during business hours. For urgent medicines, we prioritize verification.'
      },
      {
        question: 'What if my prescription is rejected?',
        answer: 'If a prescription is rejected, we\'ll inform you via SMS/email with the reason. You can upload a new prescription or contact your doctor for clarification.'
      },
      {
        question: 'Can I use expired prescriptions?',
        answer: 'We cannot accept expired prescriptions for safety reasons. Please get a fresh prescription from your doctor before ordering.'
      }
    ]
  },
  {
    title: 'Payments & Refunds',
    faqs: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major payment methods including credit/debit cards, net banking, UPI, wallets, and cash on delivery for eligible orders.'
      },
      {
        question: 'Is it safe to pay online?',
        answer: 'Yes, all online payments are processed through secure payment gateways with 256-bit SSL encryption to protect your financial information.'
      },
      {
        question: 'What is your refund policy?',
        answer: 'Due to safety regulations, medicines cannot be returned once delivered. However, we provide full refunds for damaged, expired, or wrong items delivered.'
      },
      {
        question: 'How long do refunds take?',
        answer: 'Refunds are processed within 5-7 business days. The time taken for the amount to reflect in your account depends on your bank/payment method.'
      },
      {
        question: 'Can I get cashback on orders?',
        answer: 'Yes, we regularly offer cashback promotions. Check the offers section or your wallet for available cashback deals.'
      }
    ]
  },
  {
    title: 'Account & Security',
    faqs: [
      {
        question: 'How do I create an account?',
        answer: 'Click on "Sign Up" and provide your mobile number, email, and basic details. Verify your mobile number with the OTP sent to complete registration.'
      },
      {
        question: 'I forgot my password. What should I do?',
        answer: 'Click on "Forgot Password" on the login page, enter your registered email/mobile, and follow the instructions to reset your password.'
      },
      {
        question: 'How do I update my profile information?',
        answer: 'Go to "My Profile" in your account dashboard where you can update your personal information, addresses, and contact details.'
      },
      {
        question: 'Is my personal information safe?',
        answer: 'Yes, we use industry-standard security measures to protect your data. Your information is encrypted and never shared with third parties without consent.'
      },
      {
        question: 'Can I delete my account?',
        answer: 'Yes, you can request account deletion by contacting customer support. Note that this action is irreversible and you\'ll lose access to order history.'
      }
    ]
  },
  {
    title: 'Medicines & Availability',
    faqs: [
      {
        question: 'Are all medicines available on MediQuick?',
        answer: 'We stock a wide range of medicines, but some specialized or controlled substances may not be available. Use our search feature to check availability.'
      },
      {
        question: 'What if a medicine is out of stock?',
        answer: 'If a medicine is out of stock, we\'ll suggest alternatives or you can set up notifications to be informed when it becomes available.'
      },
      {
        question: 'Are the medicines genuine?',
        answer: 'Yes, all medicines are sourced directly from authorized distributors and manufacturers. We maintain proper storage conditions and check expiry dates regularly.'
      },
      {
        question: 'Do you offer generic alternatives?',
        answer: 'Yes, we offer generic alternatives for most branded medicines. Our pharmacists can suggest cost-effective generic options during consultation.'
      },
      {
        question: 'How do I know if a medicine requires prescription?',
        answer: 'Prescription-required medicines are clearly marked with an "Rx" symbol. You cannot purchase these without uploading a valid prescription.'
      }
    ]
  }
];

export default function FAQPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleFaq = (categoryIndex, faqIndex) => {
    const faqId = `${categoryIndex}-${faqIndex}`;
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <Layout title="Frequently Asked Questions - MediQuick">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 mb-8">Find quick answers to common questions about MediQuick</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>
        </div>

        {!searchTerm && (
          <>
            {/* Category Navigation */}
            <div className="mb-8">
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {faqCategories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(index)}
                    className={`px-4 py-2 rounded-full font-medium transition-colors ${
                      selectedCategory === index
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Category FAQs */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {faqCategories[selectedCategory].title}
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {faqCategories[selectedCategory].faqs.map((faq, faqIndex) => (
                  <div key={faqIndex}>
                    <button
                      onClick={() => toggleFaq(selectedCategory, faqIndex)}
                      className="w-full px-6 py-4 text-left hover:bg-gray-50 flex justify-between items-start"
                    >
                      <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                      {expandedFaq === `${selectedCategory}-${faqIndex}` ? (
                        <ChevronUpIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === `${selectedCategory}-${faqIndex}` && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Search Results */}
        {searchTerm && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600">
                Showing results for "<span className="font-medium">{searchTerm}</span>"
              </p>
            </div>
            
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-white rounded-lg shadow-md">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {category.faqs.map((faq, faqIndex) => (
                      <div key={faqIndex}>
                        <button
                          onClick={() => toggleFaq(categoryIndex, faqIndex)}
                          className="w-full px-6 py-4 text-left hover:bg-gray-50 flex justify-between items-start"
                        >
                          <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                          {expandedFaq === `${categoryIndex}-${faqIndex}` ? (
                            <ChevronUpIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDownIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        {expandedFaq === `${categoryIndex}-${faqIndex}` && (
                          <div className="px-6 pb-4">
                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No FAQs found matching your search.</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-primary-600 hover:text-primary-700"
                >
                  View all FAQs
                </button>
              </div>
            )}
          </div>
        )}

        {/* Still Need Help */}
        <div className="mt-12 bg-primary-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Still need help?</h3>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/help"
              className="inline-flex items-center px-6 py-3 border border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
            >
              Visit Help Center
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}