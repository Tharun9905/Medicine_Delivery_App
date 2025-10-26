const smsService = require('./src/services/sms.service');

console.log('=== Manual Test: SMS Service ===');

// Test 1: OTP functionality in mock mode
async function testOTPMock() {
  console.log('\n--- Test 1: OTP Mock Mode ---');
  
  process.env.MOCK_SMS = 'true';
  
  try {
    const result = await smsService.sendSMS('+911234567890', 'Your OTP is 123456');
    console.log('✅ Mock OTP Result:', result);
  } catch (error) {
    console.log('❌ Mock OTP Error:', error);
  }
}

// Test 2: Phone number validation
async function testPhoneValidation() {
  console.log('\n--- Test 2: Phone Validation ---');
  
  try {
    const result = await smsService.sendSMS('invalid_number', 'Test message');
    console.log('❌ Should have failed:', result);
  } catch (error) {
    console.log('✅ Validation working:', error.message);
  }
}

// Test 3: Check server status
async function testServerStatus() {
  console.log('\n--- Test 3: Server Status ---');
  
  const fetch = require('node-fetch');
  
  try {
    const response = await fetch('http://localhost:5000/api/health');
    const data = await response.json();
    console.log('✅ Backend Server:', data);
  } catch (error) {
    console.log('❌ Backend Server Error:', error.message);
  }
}

async function runTests() {
  try {
    await testOTPMock();
    await testPhoneValidation();
    await testServerStatus();
  } catch (error) {
    console.error('Test error:', error);
  }
}

runTests();