module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.js',
    '**/*.test.js'
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/routes/*.js', // Exclude route files as they're mainly wiring
    '!coverage/**',
    '!node_modules/**'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup-controllers.js'],
  testTimeout: 10000
};