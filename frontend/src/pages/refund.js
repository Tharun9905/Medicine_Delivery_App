import Layout from '../components/common/Layout';
import { 
  CurrencyDollarIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function RefundPolicyPage() {
  return (
    <Layout title="Refund Policy - MediQuick">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <CurrencyDollarIcon className="w-16 h-16 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund Policy</h1>
          <p className="text-xl text-gray-600">Last updated: January 2024</p>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12">
          <div className="flex items-start space-x-3">
            <InformationCircleIcon className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-medium text-blue-900">Our Commitment</h3>
              <p className="text-blue-800 mt-1">
                While medicines generally cannot be returned due to safety regulations, we ensure fair refunds 
                for situations covered under our policy. Your satisfaction and safety are our priorities.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
              <h3 className="text-xl font-semibold text-green-900">Refund Eligible</h3>
            </div>
            <ul className="space-y-2 text-green-800">
              <li>• Wrong medicine delivered</li>
              <li>• Damaged or defective products</li>
              <li>• Expired medicines received</li>
              <li>• Cancelled orders before dispatch</li>
              <li>• Payment processing errors</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <XCircleIcon className="w-8 h-8 text-red-600" />
              <h3 className="text-xl font-semibold text-red-900">No Refund</h3>
            </div>
            <ul className="space-y-2 text-red-800">
              <li>• Correctly delivered medicines</li>
              <li>• Change of mind after delivery</li>
              <li>• Orders delivered successfully</li>
              <li>• Prescription verification issues</li>
              <li>• Used or opened packages</li>
            </ul>
          </div>
        </div>

        {/* Policy Content */}
        <div className="prose prose-lg max-w-none">
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">1. General Refund Policy</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                Due to the nature of pharmaceutical products and safety regulations, MediQuick follows a 
                strict refund policy to ensure customer safety and product integrity.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Safety First</h4>
                    <p className="text-yellow-800 mt-1">
                      Once medicines leave our facility and are delivered, they cannot be returned or 
                      resold due to storage condition uncertainties and contamination risks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">2. Eligible Refund Scenarios</h2>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">Wrong Medicine Delivered</h3>
                <p className="text-gray-600 mb-3">
                  If you receive a different medicine than what you ordered, we provide a full refund 
                  and immediate redelivery of the correct medicine at no extra cost.
                </p>
                <div className="text-sm text-gray-500">
                  <strong>Claim Period:</strong> Within 24 hours of delivery
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">Damaged or Defective Products</h3>
                <p className="text-gray-600 mb-3">
                  Medicines damaged during transit or manufacturing defects are eligible for full refund 
                  or replacement.
                </p>
                <div className="text-sm text-gray-500">
                  <strong>Requirements:</strong> Photo evidence required, original packaging must be intact
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">Expired Medicines</h3>
                <p className="text-gray-600 mb-3">
                  If you receive expired medicines, we provide immediate full refund and replacement 
                  with fresh stock.
                </p>
                <div className="text-sm text-gray-500">
                  <strong>Action:</strong> Immediate investigation and supplier audit initiated
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">Order Cancellation</h3>
                <p className="text-gray-600 mb-3">
                  Orders cancelled before dispatch are eligible for full refund. Cancellation after 
                  dispatch may incur delivery charges.
                </p>
                <div className="text-sm text-gray-500">
                  <strong>Cancellation Window:</strong> Up to 15 minutes after order confirmation
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">Payment Processing Errors</h3>
                <p className="text-gray-600 mb-3">
                  Double charges, failed deliveries due to our error, or technical payment issues 
                  are fully refunded.
                </p>
                <div className="text-sm text-gray-500">
                  <strong>Processing:</strong> Automatic refund within 24 hours
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">3. Non-Refundable Scenarios</h2>
            <div className="text-gray-600 space-y-4">
              <p>The following situations are not eligible for refunds:</p>
              
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong>Correct Order Delivered:</strong> When the right medicines are delivered as per 
                  the prescription and order details
                </li>
                <li>
                  <strong>Change of Mind:</strong> Refunds are not available if you no longer need the 
                  medicine after successful delivery
                </li>
                <li>
                  <strong>Prescription Issues:</strong> If your doctor changes the prescription after order 
                  placement (though we may offer store credit)
                </li>
                <li>
                  <strong>Delivery Acceptance:</strong> Once you accept delivery and confirm the medicine 
                  is correct, refunds are not possible
                </li>
                <li>
                  <strong>Opened Packages:</strong> For safety reasons, opened medicine packages cannot 
                  be refunded
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">4. Refund Process & Timeline</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-medium text-gray-900 mb-4 flex items-center">
                  <ClockIcon className="w-6 h-6 text-primary-600 mr-2" />
                  Refund Timeline
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Immediate (0-24 hours)</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Order cancellation before dispatch</li>
                      <li>• Payment processing errors</li>
                      <li>• System technical issues</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Standard (5-7 business days)</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Wrong medicine delivered</li>
                      <li>• Damaged products</li>
                      <li>• Quality issues</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-medium text-gray-900 mb-4">How to Request a Refund</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</span>
                    <p className="text-gray-600">Contact customer support within 24 hours of delivery</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</span>
                    <p className="text-gray-600">Provide order ID, issue description, and photos if applicable</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</span>
                    <p className="text-gray-600">Our team will verify and approve eligible refund requests</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">4</span>
                    <p className="text-gray-600">Refund processed to original payment method</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">5. Refund Methods</h2>
            <div className="text-gray-600 space-y-4">
              <p>Refunds are processed using the same method as your original payment:</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Digital Payments</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Credit/Debit Cards: 5-7 business days</li>
                    <li>• Net Banking: 3-5 business days</li>
                    <li>• UPI/Wallets: 1-3 business days</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Cash Payments</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Bank transfer to your account</li>
                    <li>• Store credit (if preferred)</li>
                    <li>• Processing time: 3-5 business days</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-blue-800">
                  <strong>Note:</strong> Bank processing times may vary. If you don't receive your refund 
                  within the specified timeframe, please contact your bank or our customer support.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">6. Special Circumstances</h2>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">Prescription Verification Issues</h3>
                <p className="text-gray-600 mb-3">
                  If your prescription is rejected after payment, you'll receive a full refund. However, 
                  we may offer to hold the payment while you obtain a valid prescription.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">Out of Stock Situations</h3>
                <p className="text-gray-600 mb-3">
                  If medicines become unavailable after order confirmation, you can choose between 
                  a full refund or waiting for restock with an alternative medicine suggestion.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">Delivery Failures</h3>
                <p className="text-gray-600 mb-3">
                  If we cannot deliver due to incorrect address or unavailability after multiple attempts, 
                  refunds are processed minus reasonable delivery attempt costs.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">7. Contact Information</h2>
            <div className="text-gray-600">
              <p className="mb-4">For refund requests or questions about our policy:</p>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Customer Support</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Phone:</strong> +91 1800-XXX-XXXX</p>
                      <p><strong>Email:</strong> refunds@mediquick.com</p>
                      <p><strong>Chat:</strong> Available on website</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Support Hours</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Weekdays:</strong> 9 AM - 9 PM</p>
                      <p><strong>Weekends:</strong> 10 AM - 6 PM</p>
                      <p><strong>Emergency:</strong> 24/7 for urgent issues</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Footer CTA */}
        <div className="text-center bg-primary-50 rounded-lg p-8 mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help with a Refund?</h3>
          <p className="text-gray-600 mb-6">
            Our customer support team is ready to assist you with any refund-related questions or requests.
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