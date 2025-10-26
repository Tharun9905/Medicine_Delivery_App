import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/auth.service';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function Login() {
  const [step, setStep] = useState(1); // 1: phone, 2: otp
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpData, setOtpData] = useState(null);

  const { login } = useAuth();
  const router = useRouter();

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login(phoneNumber);

      if (response.success) {
        setOtpData(response);
        setStep(2);
        toast.success('OTP sent successfully');

        // For development - show OTP in console and toast
        if (response.otp) {
          console.log('Development OTP:', response.otp);
          toast.success(`Development OTP: ${response.otp}`, { 
            duration: 10000,
            style: { background: '#059669', color: 'white' }
          });
        }
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error('Please enter valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      await login(phoneNumber, otp);
      const redirectTo = router.query.redirect || '/';
      router.push(redirectTo);
    } catch (error) {
      toast.error(error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      const response = await authService.login(phoneNumber);
      if (response.success) {
        toast.success('OTP resent successfully');
        if (response.otp) {
          console.log('Development OTP:', response.otp);
        }
      }
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
              </svg>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            {step === 1 ? 'Sign in to MediQuick' : 'Verify OTP'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 1 ? (
              <>
                Or{' '}
                <Link href="/auth/register" className="font-medium text-primary-600 hover:text-primary-500">
                  create a new account
                </Link>
              </>
            ) : (
              `We've sent a 6-digit OTP to ${phoneNumber}`
            )}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1 relative">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    maxLength="15"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !phoneNumber}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <LoadingSpinner size="small" color="white" /> : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <div className="mt-1">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    autoComplete="one-time-code"
                    required
                    maxLength="6"
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-center text-lg font-mono tracking-widest sm:text-sm"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <LoadingSpinner size="small" color="white" /> : 'Verify OTP'}
              </button>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp('');
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  ← Back to phone number
                </button>

                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-sm text-primary-600 hover:text-primary-500 disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Emergency Access */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact us at{' '}
            <a href="tel:1800-123-4567" className="text-primary-600 font-medium">
              1800-123-4567
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}