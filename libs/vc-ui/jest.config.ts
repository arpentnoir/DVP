/* eslint-disable */
export default {
  displayName: 'vc-ui',
  preset: '../../jest.preset.js',
  setupFiles: ['./jest.setup.ts'],
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/vc-ui',
};
