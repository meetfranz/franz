const path = require('path');
const baseConfig = require('../../webpack.config.base')(__dirname);

module.exports = Object.assign({}, baseConfig, {
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'lib'),
    libraryTarget: 'commonjs2',
  },
});
