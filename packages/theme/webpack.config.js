const path = require('path');

console.log(__dirname);

module.exports = {
  context: __dirname,
  entry: path.join(__dirname, '/src/index.ts'),
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
  devtool: 'inline-source-map',
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
};
