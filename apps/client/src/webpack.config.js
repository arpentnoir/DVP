// Including a webpack config to include fallback for some NodeJS libraries
// since we're using some utilities that are shared across Front and Back ends.

const webpack = require('webpack');
const nrwlConfig = require('@nrwl/react/plugins/webpack.js');
const { merge } = require('webpack-merge');

module.exports = (config) => {
  nrwlConfig(config);
  // eslint-disable-next-line
  return merge(config, {
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
      },
    },
  });
};
