// Mock environment variables for controller tests
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';
process.env.JWT_EXPIRE = '7d';
process.env.NODE_ENV = 'test';
process.env.MOCK_SMS = 'true';

// Mock mongoose for controller tests that don't need real database
class MockSchema {
  constructor(definition, options) {
    this.definition = definition;
    this.options = options;
    this.methods = {};
    this.statics = {};
  }

  index() {
    return this;
  }

  virtual() {
    return {
      get: () => this,
      set: () => this
    };
  }

  pre() {
    return this;
  }

  post() {
    return this;
  }

  method() {
    return this;
  }

  static Types = {
    ObjectId: 'ObjectId'
  };
}

const mockMongoose = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  connection: {
    readyState: 1, // Connected
    collections: {}
  },
  Schema: MockSchema,
  model: jest.fn(() => jest.fn())
};

jest.doMock('mongoose', () => mockMongoose);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});