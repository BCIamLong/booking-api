/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  // rootDir: 'src',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/*.spec.ts', '**/api/**/*.spec.ts'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
}
