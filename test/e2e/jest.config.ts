import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  verbose: true,
  testRegex: '.*\\.e2e-spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
  rootDir: '../../',
  roots: ['<rootDir>/src', '<rootDir>/test/e2e'],
  setupFiles: ['./test/jest-setup-file.ts'],
};
export default config;
