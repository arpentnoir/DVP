/* eslint-disable */
export default {
  displayName: 'client',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/client',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  setupFiles: ['./jest.env.setup.ts'],
  moduleNameMapper: {
    '^react-pdf': 'react-pdf/dist/umd/entry',
  },
};
