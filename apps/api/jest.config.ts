/* eslint-disable */
import type { Config } from 'jest';
const config: Config = {
  displayName: 'api unit tests',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  setupFilesAfterEnv: ['../../jest.proxy.setup.ts', './jest.setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/api',
  testMatch: ['**/**/*.spec.{ts, js}', '**/**/*.test.{ts, js}'],
  coverageThreshold: {
    global: {
      lines: 90,
    },
  },
};

export default config;
