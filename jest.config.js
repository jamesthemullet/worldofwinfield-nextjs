const nextJest = require('next/jest.js');

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    'next/image': '<rootDir>/__mocks__/nextImageMock.tsx',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'pages/**/*.tsx',
    'pages/**/*.ts',
    'components/**/*.tsx',
    'components/**/*.ts',
    '!**/node_modules/**',
  ],
};

module.exports = createJestConfig(config);
