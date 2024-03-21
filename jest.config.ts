/** @type {import('ts-jest').JestConfigWithTsJest} */
import type { Config } from 'jest'
import { pathsToModuleNameMapper } from 'ts-jest'
// import tsconfig from './tsconfig.json'

const config: Config = {
  rootDir: './',

  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/*.spec.ts', '**/api/**/*.spec.ts'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  moduleNameMapper: pathsToModuleNameMapper({
    // ! https://stackoverflow.com/questions/69319086/jest-not-finding-alias-path
    // !https://chat.openai.com/c/bcf98546-4512-4d3d-a657-21608ced5e12
    '~/config': ['<rootDir>/src/config']
    // '^@components/(.*)': '<rootDir>/src/components/$1'
  })
}

export default config
