const nextJest = require('next/jest.js');

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/e2e/'],
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
    'lib/**/*.ts',
    '!lib/types.ts',
    '!**/node_modules/**',
  ],
};

// `lib/sanitize.ts` requires jsdom on the server, and jsdom 30 depends on several ESM-only
// packages. Jest can't require() those without transforming them to CommonJS, and next/jest only
// appends to its transformIgnorePatterns, so add them to its node_modules exclusion list here.
// `jsdom` itself is listed so packages nested under `jsdom/node_modules` are reached too.
const esmPackages = [
  'jsdom',
  '@asamuzakjp/css-color',
  '@asamuzakjp/dom-selector',
  '@bramus/specificity',
  '@csstools/color-helpers',
  '@csstools/css-calc',
  '@csstools/css-color-parser',
  '@csstools/css-parser-algorithms',
  '@csstools/css-tokenizer',
  '@exodus/bytes',
  'css-tree',
  'entities',
  'lru-cache',
  'parse5',
  'tough-cookie',
];

module.exports = async () => {
  const resolved = await createJestConfig(config)();
  return {
    ...resolved,
    transformIgnorePatterns: resolved.transformIgnorePatterns.map((pattern) =>
      pattern.startsWith('/node_modules/')
        ? pattern.replace('(?!(', `(?!(${esmPackages.join('|')}|`)
        : pattern,
    ),
  };
};
