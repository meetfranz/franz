const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const IS_DEV = process.env.NODE_ENV === 'development';

module.exports = dir => ({
  context: dir,
  entry: path.join(dir, '/src/index.ts'),
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
    }],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'inline-source-map',
  mode: IS_DEV ? 'development' : 'production',
  optimization: {
    minimizer: !IS_DEV ? [new TerserPlugin()] : [],
  },
});
