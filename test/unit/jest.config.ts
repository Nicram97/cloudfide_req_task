import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  verbose: true,
  silent: true,
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageReporters: ['json', 'html', 'text', 'cobertura', 'text-summary'],
  reporters: ['jest-junit', 'default'],
  testEnvironment: 'node',
  rootDir: process.cwd(),
  roots: ['<rootDir>/src', '<rootDir>/test/unit'],
  coveragePathIgnorePatterns: [
    'jest.config.ts',
    'main.ts',
    '.*\\.module\\.ts$',
    'constants.ts',
    '.*\\.entity\\.ts$',
    '.*\\.dto\\.ts$',
  ],
  setupFiles: ['./test/jest-setup-file.ts'],
};
export default config;
