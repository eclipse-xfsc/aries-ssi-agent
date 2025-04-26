import config from '../jest.config.js';

/** @type {import('jest').Config} */
export default {
  ...config,
  testTimeout: 60000,
  rootDir: '.',
  testRegex: '.*\\.e2e-spec\\.ts$',
  globalSetup: '<rootDir>/_setup.ts',
  globalTeardown: '<rootDir>/_teardown.ts',
};
