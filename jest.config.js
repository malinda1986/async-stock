module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/protocols/*.ts',
    '!<rootDir>/src/**/index*.ts',
    '!<rootDir>/src/__tests__/**/*.ts',
    '!<rootDir>/src/config/*.ts',
    '!<rootDir>/src/infra/db/seed-products.ts',
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['./src/config/tests.ts'],
  coverageReporters: ['lcov'],
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  testMatch: ['**/?(*.)+(spec|test).ts'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
};
