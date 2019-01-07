const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, '/src/index.ts'),
  context: __dirname,
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'lib'),
    libraryTarget: 'commonjs2',
  },
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
  externals: {
    '@meetfranz/theme': '@meetfranz/theme',
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash',
      root: '_',
    },
    classnames: 'classnames',
    mobx: 'mobx',
    mobxReact: 'mobx-react',
    react: 'react',
    reactJss: 'react-jss',
  },
  devtool: 'inline-source-map',
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
};
