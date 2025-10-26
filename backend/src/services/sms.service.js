const axios = require('axios');
const twilio = require('twilio');

class SMSService {
  constructor() {
    this.provider = process.env.SMS_SERVICE || 'twilio';
    this.mockMode = process.env.MOCK_SMS === 'true';
    this.initializeProvider();
  }

  initializeProvider() {
    if (this.mockMode) {
      console.log('SMS Service: Using mock mode - no actual SMS will be sent');
      return;
    }

    switch (this.provider) {
      case 'twilio':
        this.initializeTwilio();
        break;
      case 'textlocal':
        this.initializeTextLocal();
        break;
      case 'msg91':
        this.initializeMSG91();
        break;
      default:
        console.warn(`Unknown SMS provider: ${this.provider}. Using mock mode.`);
        this.mockMode = true;
    }
  }

  initializeTwilio() {
    try {
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        if (process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
          this.twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
          console.log('SMS Service: Twilio initialized successfully');
        } else {
          console.warn('Invalid Twilio Account SID format. Using mock mode.');
          this.mockMode = true;
        }
      } else {
        console.warn('Twilio credentials not provided. Using mock mode.');
        this.mockMode = true;
      }
    } catch (error) {
      console.error('Failed to initialize Twilio:', error);
      this.mockMode = true;
    }
  }

  initializeTextLocal() {
    if (process.env.TEXTLOCAL_API_KEY) {
      this.textlocalConfig = {
        apiKey: process.env.TEXTLOCAL_API_KEY,
        sender: process.env.TEXTLOCAL_SENDER || 'MEDQCK'
      };
      console.log('SMS Service: TextLocal initialized successfully');
    } else {
      console.warn('TextLocal API key not provided. Using mock mode.');
      this.mockMode = true;
    }
  }

  initializeMSG91() {
    if (process.env.MSG91_AUTH_KEY) {
      this.msg91Config = {
        authKey: process.env.MSG91_AUTH_KEY,
        senderId: process.env.MSG91_SENDER_ID || 'MEDQCK'
      };
      console.log('SMS Service: MSG91 initialized successfully');
    } else {
      console.warn('MSG91 auth key not provided. Using mock mode.');
      this.mockMode = true;
    }
  }

  async sendOTP(phoneNumber, otp, type = 'verification') {
    if (this.mockMode) {
      console.log(`[MOCK SMS] Sending ${type} OTP ${otp} to ${phoneNumber}`);
      return { success: true, provider: 'mock', message: 'SMS sent in mock mode' };
    }

    try {
      let result;

      switch (this.provider) {
        case 'twilio':
          result = await this.sendTwilioOTP(phoneNumber, otp, type);
          break;
        case 'textlocal':
          result = await this.sendTextLocalOTP(phoneNumber, otp, type);
          break;
        case 'msg91':
          result = await this.sendMSG91OTP(phoneNumber, otp, type);
          break;
        default:
          throw new Error(`Unsupported SMS provider: ${this.provider}`);
      }

      console.log(`SMS sent successfully via ${this.provider} to ${phoneNumber}`);
      return { ...result, success: true, provider: this.provider };

    } catch (error) {
      console.error(`SMS sending failed via ${this.provider}:`, error.message);
      
      // Try fallback provider
      const fallbackResult = await this.tryFallback(phoneNumber, otp, type);
      if (fallbackResult) {
        return fallbackResult;
      }

      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }

  async sendTwilioOTP(phoneNumber, otp, type) {
    const message = this.getOTPMessage(otp, type);
    
    const result = await this.twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    return {
      messageId: result.sid,
      status: result.status
    };
  }

  async sendTextLocalOTP(phoneNumber, otp, type) {
    const message = this.getOTPMessage(otp, type);
    
    const response = await axios.post('https://api.textlocal.in/send/', {
      apikey: this.textlocalConfig.apiKey,
      numbers: phoneNumber,
      message: message,
      sender: this.textlocalConfig.sender
    });

    if (response.data.status !== 'success') {
      throw new Error(response.data.errors?.[0]?.message || 'TextLocal API error');
    }

    return {
      messageId: response.data.messages?.[0]?.id,
      status: response.data.status
    };
  }

  async sendMSG91OTP(phoneNumber, otp, type) {
    const message = this.getOTPMessage(otp, type);
    
    const response = await axios.post('https://api.msg91.com/api/sendhttp.php', {
      authkey: this.msg91Config.authKey,
      mobiles: phoneNumber,
      message: message,
      sender: this.msg91Config.senderId,
      route: 4,
      country: 91 // India country code
    });

    if (response.data.type !== 'success') {
      throw new Error(response.data.message || 'MSG91 API error');
    }

    return {
      messageId: response.data.request_id,
      status: response.data.type
    };
  }

  async tryFallback(phoneNumber, otp, type) {
    const fallbackProviders = ['twilio', 'textlocal', 'msg91'].filter(p => p !== this.provider);
    
    for (const provider of fallbackProviders) {
      try {
        console.log(`Trying fallback SMS provider: ${provider}`);
        
        const tempProvider = this.provider;
        this.provider = provider;
        this.initializeProvider();
        
        if (!this.mockMode) {
          const result = await this.sendOTP(phoneNumber, otp, type);
          console.log(`Fallback SMS sent successfully via ${provider}`);
          return result;
        }
        
        this.provider = tempProvider;
        
      } catch (error) {
        console.error(`Fallback provider ${provider} also failed:`, error.message);
        this.provider = tempProvider;
        continue;
      }
    }

    return null; // All fallbacks failed
  }

  getOTPMessage(otp, type) {
    const messages = {
      registration: `Welcome to MediQuick! Your verification code is: ${otp}. Valid for 10 minutes. Do not share this OTP.`,
      login: `Your MediQuick login code is: ${otp}. Valid for 10 minutes. Do not share this OTP.`,
      verification: `Your MediQuick verification code is: ${otp}. Valid for 10 minutes. Do not share this OTP.`,
      'phone-change': `Your MediQuick phone change verification code is: ${otp}. Valid for 10 minutes. Do not share this OTP.`
    };

    return messages[type] || messages.verification;
  }

  // Method to send custom SMS (for notifications, order updates, etc.)
  async sendNotification(phoneNumber, message) {
    if (this.mockMode) {
      console.log(`[MOCK SMS] Sending notification to ${phoneNumber}: ${message}`);
      return { success: true, provider: 'mock' };
    }

    try {
      let result;

      switch (this.provider) {
        case 'twilio':
          result = await this.twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
          });
          break;
        
        case 'textlocal':
          const response = await axios.post('https://api.textlocal.in/send/', {
            apikey: this.textlocalConfig.apiKey,
            numbers: phoneNumber,
            message: message,
            sender: this.textlocalConfig.sender
          });
          result = response.data;
          break;
        
        case 'msg91':
          const msg91Response = await axios.post('https://api.msg91.com/api/sendhttp.php', {
            authkey: this.msg91Config.authKey,
            mobiles: phoneNumber,
            message: message,
            sender: this.msg91Config.senderId,
            route: 4,
            country: 91
          });
          result = msg91Response.data;
          break;
      }

      return { success: true, provider: this.provider, result };

    } catch (error) {
      console.error('SMS notification failed:', error);
      throw new Error(`Failed to send SMS notification: ${error.message}`);
    }
  }

  // Get service status
  getStatus() {
    return {
      provider: this.provider,
      mockMode: this.mockMode,
      initialized: !this.mockMode
    };
  }
}

// Export the class and create singleton instance
const smsService = new SMSService();

module.exports = smsService;
module.exports.SMSService = SMSService;