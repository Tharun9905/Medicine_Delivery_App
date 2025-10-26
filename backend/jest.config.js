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
  testTimeout: 30000,
  projects: [
    {
      displayName: 'controllers',
      testMatch: ['<rootDir>/tests/controllers/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup-controllers.js']
    },
    {
      displayName: 'models',
      testMatch: ['<rootDir>/tests/models/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
    }
  ]
};