const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    devMiddleware: {
      publicPath: '/dist',
    },
    static: './public',
    hot: true,
  },
});
