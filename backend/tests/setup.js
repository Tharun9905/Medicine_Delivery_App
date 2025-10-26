const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

// Setup in-memory MongoDB for testing
beforeAll(async () => {
  // Ensure no existing connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

// Clear database between tests
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Cleanup after all tests
afterAll(async () => {
  if (mongod) {
    await mongoose.disconnect();
    await mongod.stop();
  }
});

// Mock environment variables
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';
process.env.JWT_EXPIRE = '7d';
process.env.NODE_ENV = 'test';
process.env.MOCK_SMS = 'true';