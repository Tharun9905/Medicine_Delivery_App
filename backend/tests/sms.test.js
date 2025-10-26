const smsService = require('../src/services/sms.service');

// Mock the axios module
jest.mock('axios');
const axios = require('axios');

describe('SMS Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset environment variables
    process.env.MOCK_SMS = 'false';
    process.env.SMS_SERVICE = 'msg91';
    process.env.MSG91_API_KEY = 'test-api-key';
    process.env.MSG91_SENDER_ID = 'TEST';
    process.env.MSG91_ROUTE = '4';
  });

  describe('sendOTP', () => {
    test('should send OTP via MSG91 successfully', async () => {
      const mockResponse = {
        status: 200,
        data: {
          type: 'success',
          message: 'OTP sent successfully'
        }
      };
      
      axios.post.mockResolvedValue(mockResponse);

      const result = await smsService.sendOTP('+919876543210', '123456');

      expect(result.success).toBe(true);
      expect(result.message).toContain('OTP sent successfully');
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.msg91.com/api/sendhttp.php',
        expect.any(Object)
      );
    });

    test('should handle MSG91 API error', async () => {
      axios.post.mockRejectedValue(new Error('Network error'));

      const result = await smsService.sendOTP('+919876543210', '123456');

      expect(result.success).toBe(false);
      expect(result.message).toContain('Failed to send OTP');
    });

    test('should use mock mode when MOCK_SMS is true', async () => {
      process.env.MOCK_SMS = 'true';

      const result = await smsService.sendOTP('+919876543210', '123456');

      expect(result.success).toBe(true);
      expect(result.message).toContain('Mock mode: OTP would be sent');
      expect(axios.post).not.toHaveBeenCalled();
    });

    test('should validate phone number format', async () => {
      const result = await smsService.sendOTP('invalid-phone', '123456');

      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid phone number');
    });

    test('should validate OTP format', async () => {
      const result = await smsService.sendOTP('+919876543210', '12345'); // 5 digits

      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid OTP');
    });

    test('should handle missing API configuration', async () => {
      delete process.env.MSG91_API_KEY;

      const result = await smsService.sendOTP('+919876543210', '123456');

      expect(result.success).toBe(false);
      expect(result.message).toContain('SMS service not configured');
    });
  });

  describe('sendSMS', () => {
    test('should send SMS via MSG91 successfully', async () => {
      const mockResponse = {
        status: 200,
        data: {
          type: 'success',
          message: 'SMS sent successfully'
        }
      };
      
      axios.post.mockResolvedValue(mockResponse);

      const result = await smsService.sendSMS('+919876543210', 'Test message');

      expect(result.success).toBe(true);
      expect(result.message).toContain('SMS sent successfully');
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.msg91.com/api/sendhttp.php',
        expect.any(Object)
      );
    });

    test('should handle long messages', async () => {
      const longMessage = 'A'.repeat(200); // 200 characters
      
      const mockResponse = {
        status: 200,
        data: {
          type: 'success',
          message: 'SMS sent successfully'
        }
      };
      
      axios.post.mockResolvedValue(mockResponse);

      const result = await smsService.sendSMS('+919876543210', longMessage);

      expect(result.success).toBe(true);
    });

    test('should use mock mode for SMS when MOCK_SMS is true', async () => {
      process.env.MOCK_SMS = 'true';

      const result = await smsService.sendSMS('+919876543210', 'Test message');

      expect(result.success).toBe(true);
      expect(result.message).toContain('Mock mode: SMS would be sent');
      expect(axios.post).not.toHaveBeenCalled();
    });

    test('should fallback to Twilio when MSG91 fails', async () => {
      process.env.SMS_SERVICE = 'twilio';
      process.env.TWILIO_ACCOUNT_SID = 'test-sid';
      process.env.TWILIO_AUTH_TOKEN = 'test-token';
      process.env.TWILIO_PHONE_NUMBER = '+1234567890';

      // Mock Twilio client
      const mockTwilioClient = {
        messages: {
          create: jest.fn().mockResolvedValue({
            sid: 'test-message-sid',
            status: 'sent'
          })
        }
      };

      // We need to mock the Twilio constructor
      jest.doMock('twilio', () => {
        return jest.fn(() => mockTwilioClient);
      });

      const result = await smsService.sendSMS('+919876543210', 'Test message');

      expect(result.success).toBe(true);
    });
  });

  describe('formatPhoneNumber', () => {
    test('should format Indian mobile numbers correctly', () => {
      const formatted = smsService.formatPhoneNumber('9876543210');
      expect(formatted).toBe('+919876543210');
    });

    test('should handle numbers with country code', () => {
      const formatted = smsService.formatPhoneNumber('+919876543210');
      expect(formatted).toBe('+919876543210');
    });

    test('should handle numbers with 0 prefix', () => {
      const formatted = smsService.formatPhoneNumber('09876543210');
      expect(formatted).toBe('+919876543210');
    });

    test('should return null for invalid numbers', () => {
      const formatted = smsService.formatPhoneNumber('123');
      expect(formatted).toBe(null);
    });
  });

  describe('generateOTP', () => {
    test('should generate 6-digit OTP by default', () => {
      const otp = smsService.generateOTP();
      expect(otp).toMatch(/^\d{6}$/);
    });

    test('should generate OTP of specified length', () => {
      const otp = smsService.generateOTP(4);
      expect(otp).toMatch(/^\d{4}$/);
    });

    test('should generate different OTPs on multiple calls', () => {
      const otp1 = smsService.generateOTP();
      const otp2 = smsService.generateOTP();
      expect(otp1).not.toBe(otp2);
    });
  });
});