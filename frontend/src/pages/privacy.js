import Layout from '../components/common/Layout';
import { ShieldCheckIcon, LockClosedIcon, EyeIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function PrivacyPolicyPage() {
  return (
    <Layout title="Privacy Policy - MediQuick">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <ShieldCheckIcon className="w-16 h-16 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">Last updated: January 2024</p>
        </div>

        {/* Quick Summary */}
        <div className="bg-primary-50 rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy at a Glance</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <LockClosedIcon className="w-6 h-6 text-primary-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Secure Data</h3>
                <p className="text-sm text-gray-600">We use industry-standard encryption to protect your information</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <EyeIcon className="w-6 h-6 text-primary-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Transparent</h3>
                <p className="text-sm text-gray-600">Clear information about how we collect and use your data</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <UserGroupIcon className="w-6 h-6 text-primary-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Your Control</h3>
                <p className="text-sm text-gray-600">You have control over your personal information</p>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Content */}
        <div className="prose prose-lg max-w-none">
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">1. Information We Collect</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Personal Information</h3>
                <p className="text-gray-600 mb-3">When you use MediQuick, we collect information that you provide directly to us:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Name, email address, and phone number</li>
                  <li>Delivery addresses</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Prescription information and medical data (when you upload prescriptions)</li>
                  <li>Order history and preferences</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Usage Information</h3>
                <p className="text-gray-600 mb-3">We automatically collect certain information about your use of our services:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Device information (browser type, operating system)</li>
                  <li>Log data (IP address, access times)</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Location data (with your permission)</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">2. How We Use Your Information</h2>
            
            <div className="space-y-4 text-gray-600">
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Provide Services:</strong> Process orders, deliver medicines, and handle prescriptions</li>
                <li><strong>Communication:</strong> Send order updates, delivery notifications, and customer support</li>
                <li><strong>Safety:</strong> Verify prescriptions and ensure medication safety</li>
                <li><strong>Improvement:</strong> Analyze usage patterns to improve our services</li>
                <li><strong>Legal Compliance:</strong> Meet regulatory requirements for pharmacy operations</li>
                <li><strong>Marketing:</strong> Send promotional content (with your consent)</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">3. Information Sharing</h2>
            
            <div className="space-y-4 text-gray-600">
              <p>We do not sell, rent, or trade your personal information. We may share information in these limited circumstances:</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Service Providers</h4>
                  <p>We work with trusted partners who help us operate our business (payment processors, delivery partners, cloud storage providers).</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Healthcare Professionals</h4>
                  <p>Licensed pharmacists and doctors may access your prescription information for verification and consultation purposes.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Legal Requirements</h4>
                  <p>We may disclose information when required by law, court orders, or to protect safety and security.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Business Transfers</h4>
                  <p>In the event of a merger or acquisition, your information may be transferred to the new entity.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">4. Data Security</h2>
            
            <div className="space-y-4 text-gray-600">
              <p>We implement robust security measures to protect your information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>256-bit SSL encryption for data transmission</li>
                <li>Secure servers with regular security updates</li>
                <li>Access controls limiting who can view your information</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Compliance with healthcare data protection standards</li>
              </ul>
              <p className="mt-4">However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.</p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">5. Your Rights and Choices</h2>
            
            <div className="space-y-4 text-gray-600">
              <p>You have several rights regarding your personal information:</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Access and Update</h4>
                  <p>You can view and update your account information through your profile dashboard.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Delete Account</h4>
                  <p>You can request account deletion by contacting our support team. Some information may be retained for legal compliance.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Marketing Communications</h4>
                  <p>You can opt out of promotional emails by clicking the unsubscribe link or updating your preferences.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Cookies</h4>
                  <p>You can control cookies through your browser settings, though this may affect functionality.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">6. Special Considerations</h2>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Medical Information</h4>
                <p className="text-gray-600">Prescription and medical data receive special protection under healthcare privacy laws. This information is only accessed by licensed healthcare professionals for legitimate medical purposes.</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Children's Privacy</h4>
                <p className="text-gray-600">Our services are not intended for children under 18. We do not knowingly collect personal information from children. If we become aware of such collection, we will delete the information.</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Data Retention</h4>
                <p className="text-gray-600">We retain your information as long as necessary to provide services and comply with legal obligations. Medical records may be retained longer per healthcare regulations.</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">7. Updates to This Policy</h2>
            <p className="text-gray-600">We may update this privacy policy from time to time. We will notify you of significant changes by:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-3">
              <li>Posting the updated policy on this page</li>
              <li>Updating the "Last updated" date</li>
              <li>Sending email notifications for material changes</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">8. Contact Information</h2>
            <p className="text-gray-600 mb-4">If you have questions about this privacy policy or our data practices, please contact us:</p>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="space-y-2">
                <p><strong>Email:</strong> privacy@mediquick.com</p>
                <p><strong>Phone:</strong> +91 1800-XXX-XXXX</p>
                <p><strong>Address:</strong> 123 Healthcare Street, Medical District, Mumbai, Maharashtra 400001</p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer CTA */}
        <div className="text-center bg-primary-50 rounded-lg p-8 mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Questions About Our Privacy Policy?</h3>
          <p className="text-gray-600 mb-6">Our team is here to help you understand how we protect your information.</p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </Layout>
  );
}