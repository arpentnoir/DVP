/* eslint-disable */
export default {
  displayName: 'status-worker',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  testMatch: ['**/**/*.spec.{ts, js}', '**/**/*.test.{ts, js}'],
  coverageDirectory: '../../coverage/apps/status-worker',
};
