import Layout from '../components/common/Layout';
import { DocumentTextIcon, ScaleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function TermsOfServicePage() {
  return (
    <Layout title="Terms of Service - MediQuick">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <DocumentTextIcon className="w-16 h-16 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600">Last updated: January 2024</p>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-12">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mt-1" />
            <div>
              <h3 className="font-medium text-yellow-900">Important Legal Agreement</h3>
              <p className="text-yellow-800 mt-1">
                These terms constitute a legally binding agreement between you and MediQuick. 
                Please read carefully before using our services.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Content */}
        <div className="prose prose-lg max-w-none">
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">1. Acceptance of Terms</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                By accessing or using MediQuick's services, you agree to be bound by these Terms of Service and our Privacy Policy. 
                If you do not agree to these terms, please do not use our services.
              </p>
              <p>
                These terms apply to all users of MediQuick, including customers, healthcare professionals, and delivery partners.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">2. Service Description</h2>
            <div className="text-gray-600 space-y-4">
              <p>MediQuick is an online pharmacy platform that provides:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Online ordering and delivery of medicines</li>
                <li>Prescription verification services</li>
                <li>Healthcare consultation (where available)</li>
                <li>Medicine information and drug interactions</li>
                <li>Customer support services</li>
              </ul>
              <p>
                All pharmaceutical services are provided in compliance with applicable laws and regulations 
                governing the sale and distribution of medicines.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">3. User Eligibility and Account</h2>
            <div className="text-gray-600 space-y-4">
              <h4 className="font-medium text-gray-900">Eligibility Requirements:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must be at least 18 years old</li>
                <li>Provide accurate and complete information</li>
                <li>Have legal capacity to enter into binding agreements</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
              
              <h4 className="font-medium text-gray-900 mt-6">Account Responsibilities:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Ensure all account information is accurate and up-to-date</li>
                <li>You are responsible for all activities under your account</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">4. Prescription and Medical Services</h2>
            <div className="text-gray-600 space-y-4">
              <h4 className="font-medium text-gray-900">Prescription Requirements:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Valid prescription required for prescription-only medicines (POM)</li>
                <li>Prescriptions must be from licensed healthcare professionals</li>
                <li>We reserve the right to verify prescriptions with prescribing doctors</li>
                <li>Expired or invalid prescriptions will not be accepted</li>
              </ul>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
                <h4 className="font-medium text-red-900">Medical Disclaimer:</h4>
                <p className="text-red-800 mt-2">
                  MediQuick provides pharmaceutical services but is not a substitute for professional medical advice. 
                  Always consult qualified healthcare professionals for medical guidance. We are not responsible for 
                  medical decisions made based on information from our platform.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">5. Orders and Payments</h2>
            <div className="text-gray-600 space-y-4">
              <h4 className="font-medium text-gray-900">Order Process:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Orders are subject to acceptance and availability</li>
                <li>We may refuse orders that appear fraudulent or suspicious</li>
                <li>Prescription medicines require valid prescription verification</li>
                <li>Order confirmation does not guarantee delivery</li>
              </ul>

              <h4 className="font-medium text-gray-900 mt-6">Payment Terms:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payment is due at the time of order placement</li>
                <li>We accept various payment methods as displayed on our platform</li>
                <li>All prices are inclusive of applicable taxes unless stated otherwise</li>
                <li>We reserve the right to change prices without notice</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">6. Delivery and Returns</h2>
            <div className="text-gray-600 space-y-4">
              <h4 className="font-medium text-gray-900">Delivery Terms:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Delivery times are estimates and may vary</li>
                <li>Someone must be available to receive medicines at the delivery address</li>
                <li>ID verification may be required for certain medicines</li>
                <li>We are not liable for delays due to circumstances beyond our control</li>
              </ul>

              <h4 className="font-medium text-gray-900 mt-6">Return Policy:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Medicines generally cannot be returned due to safety regulations</li>
                <li>Defective, damaged, or wrong items may be returned within 24 hours</li>
                <li>Returns must be in original packaging with all seals intact</li>
                <li>Refunds processed within 5-7 business days of approved returns</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">7. User Conduct</h2>
            <div className="text-gray-600 space-y-4">
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide false or misleading information</li>
                <li>Use the service for illegal activities</li>
                <li>Attempt to circumvent security measures</li>
                <li>Share or resell medicines obtained through our platform</li>
                <li>Interfere with the proper functioning of our services</li>
                <li>Upload forged or fraudulent prescriptions</li>
                <li>Impersonate another person or entity</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">8. Intellectual Property</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                All content on MediQuick, including text, graphics, logos, and software, is the property of 
                MediQuick or its licensors and is protected by copyright and other intellectual property laws.
              </p>
              <p>You may not:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Copy, modify, or distribute our content without permission</li>
                <li>Use our trademarks or logos without authorization</li>
                <li>Reverse engineer or attempt to extract source code</li>
                <li>Create derivative works based on our platform</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">9. Privacy and Data Protection</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                Your privacy is important to us. Our Privacy Policy, which is incorporated into these terms, 
                explains how we collect, use, and protect your personal information.
              </p>
              <p>
                By using our services, you consent to the collection and use of information as outlined 
                in our Privacy Policy.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">10. Limitation of Liability</h2>
            <div className="text-gray-600 space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="font-medium text-gray-900 mb-2">Important Legal Notice:</p>
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, MEDIQUICK SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                  INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF OUR SERVICES.
                </p>
              </div>
              
              <p>Our liability is limited to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The amount you paid for the specific service or product</li>
                <li>Direct damages directly caused by our negligence</li>
                <li>Refunds for defective or incorrect products</li>
              </ul>

              <p>
                We are not liable for delays, service interruptions, or damages resulting from circumstances 
                beyond our reasonable control.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">11. Termination</h2>
            <div className="text-gray-600 space-y-4">
              <p>We may terminate or suspend your account immediately if you:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate these terms or our policies</li>
                <li>Engage in fraudulent or illegal activities</li>
                <li>Pose a safety risk to other users or our staff</li>
                <li>Fail to pay for services</li>
              </ul>
              <p>
                You may terminate your account at any time by contacting customer support. 
                Some obligations and restrictions may survive termination.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibent text-gray-900 mb-6">12. Governing Law and Disputes</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                These terms are governed by the laws of India. Any disputes arising from these terms 
                or your use of our services will be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.
              </p>
              <p>
                We encourage resolving disputes through our customer support team before pursuing legal action.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">13. Changes to Terms</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                We may update these terms from time to time. Significant changes will be communicated through:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email notifications to registered users</li>
                <li>Prominent notices on our platform</li>
                <li>Updates to the "Last updated" date</li>
              </ul>
              <p>
                Continued use of our services after changes constitutes acceptance of the updated terms.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">14. Contact Information</h2>
            <div className="text-gray-600">
              <p className="mb-4">For questions about these terms or our services, contact us:</p>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-2">
                  <p><strong>Legal Department:</strong> legal@mediquick.com</p>
                  <p><strong>Customer Support:</strong> +91 1800-XXX-XXXX</p>
                  <p><strong>Address:</strong> 123 Healthcare Street, Medical District, Mumbai, Maharashtra 400001</p>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Footer CTA */}
        <div className="text-center bg-primary-50 rounded-lg p-8 mt-12">
          <div className="flex justify-center mb-4">
            <ScaleIcon className="w-12 h-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Questions About These Terms?</h3>
          <p className="text-gray-600 mb-6">Our legal team is available to clarify any aspects of our terms of service.</p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Contact Legal Team
          </a>
        </div>
      </div>
    </Layout>
  );
}