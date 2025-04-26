import { readFileSync } from 'node:fs';

const swcConfig = JSON.parse(readFileSync('../../.swcrc', 'utf8'));

/** @type {import('jest').Config} */
export default {
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|js)$': [
      '@swc/jest',
      {
        ...swcConfig,
        sourceMaps: false,
        exclude: [],
        swcrc: false,
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    // ESM modules require `.js` extension to be specified, but Jest doesn't work with them
    // Removing `.js` extension from module imports
    '^uuid$': 'uuid',
    '^(.*)/(.*)\\.js$': '$1/$2',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageReporters:
    process.env.CI === 'true'
      ? ['text-summary', 'json-summary']
      : ['text-summary', 'html'],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/test/',
    '<rootDir>/coverage/',
    '<rootDir>/dist/',
    '<rootDir>/**/test',
    '@types',
    '.dto.(t|j)s',
    '.enum.ts',
    '.interface.ts',
    '.type.ts',
    '.spec.ts',
  ],
  coverageDirectory: './coverage',
  // With v8 coverage provider it's much faster, but
  // with this enabled it's not possible to ignore whole files' coverage
  coverageProvider: 'v8',
};
