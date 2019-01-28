const path = require('path');
const baseConfig = require('../../webpack.config.base')(__dirname);

module.exports = Object.assign({}, baseConfig, {
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'lib'),
    libraryTarget: 'commonjs2',
  },
  externals: {
    react: 'react',
    reactDom: 'react-dom',
    classnames: 'classnames',
    lodash: 'lodash',
    mobx: 'mobx',
    mobxReact: 'mobx-react',
    reactJss: 'react-jss',
  },
});
