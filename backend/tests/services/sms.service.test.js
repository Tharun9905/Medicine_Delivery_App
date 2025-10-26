const smsService = require('../../src/services/sms.service');

// Mock the external SMS providers
jest.mock('twilio', () => {
  return jest.fn(() => ({
    messages: {
      create: jest.fn()
    }
  }));
});

jest.mock('axios');
const axios = require('axios');

describe('SMS Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('OTP service sends SMS successfully', () => {
    test('should send OTP successfully with primary provider', async () => {
      process.env.MOCK_SMS = 'false';
      process.env.SMS_PRIMARY_PROVIDER = 'twilio';
      process.env.TWILIO_ACCOUNT_SID = 'test_sid';
      process.env.TWILIO_AUTH_TOKEN = 'test_token';
      process.env.TWILIO_PHONE_NUMBER = '+1234567890';

      const mockTwilio = require('twilio');
      mockTwilio().messages.create.mockResolvedValue({
        sid: 'test_message_sid',
        status: 'sent'
      });

      const result = await smsService.sendSMS('+911234567890', 'Your OTP is 123456');
      
      expect(result.success).toBe(true);
      expect(result.provider).toBe('twilio');
      expect(mockTwilio().messages.create).toHaveBeenCalledWith({
        body: 'Your OTP is 123456',
        from: '+1234567890',
        to: '+911234567890'
      });
    });

    test('should work in mock mode for development', async () => {
      process.env.MOCK_SMS = 'true';
      
      const result = await smsService.sendSMS('+911234567890', 'Your OTP is 123456');
      
      expect(result.success).toBe(true);
      expect(result.provider).toBe('mock');
    });
  });

  describe('OTP fails with invalid number', () => {
    test('should fail with invalid phone number', async () => {
      const result = await smsService.sendSMS('invalid_number', 'Test message');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid phone number');
    });

    test('should fail with empty phone number', async () => {
      const result = await smsService.sendSMS('', 'Test message');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Phone number is required');
    });
  });

  describe('OTP service fallback works', () => {
    test('should fallback to secondary provider when primary fails', async () => {
      process.env.MOCK_SMS = 'false';
      process.env.SMS_PRIMARY_PROVIDER = 'twilio';
      process.env.SMS_FALLBACK_PROVIDER = 'textlocal';
      process.env.TEXTLOCAL_API_KEY = 'test_key';
      process.env.TEXTLOCAL_SENDER = 'TEST';

      // Mock Twilio to fail
      const mockTwilio = require('twilio');
      mockTwilio().messages.create.mockRejectedValue(new Error('Twilio failed'));

      // Mock TextLocal to succeed
      axios.post.mockResolvedValue({
        data: {
          status: 'success',
          messages: [{ id: 'test_id', recipient: '+911234567890' }]
        }
      });

      const result = await smsService.sendSMS('+911234567890', 'Your OTP is 123456');
      
      expect(result.success).toBe(true);
      expect(result.provider).toBe('textlocal');
      expect(axios.post).toHaveBeenCalled();
    });
  });
});