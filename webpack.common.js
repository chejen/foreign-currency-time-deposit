const path = require('path');
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  entry: './ui/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public', 'dist'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        TIME_DEPOSIT_FIREBASE_CONFIG:
          JSON.stringify(process.env.TIME_DEPOSIT_FIREBASE_CONFIG),
        TIME_DEPOSIT_COLLECTION_ID: JSON.stringify(
          process.env.TIME_DEPOSIT_COLLECTION_ID || 'time-deposit',
        ),
        TIME_DEPOSIT_AUTH: JSON.stringify(process.env.TIME_DEPOSIT_AUTH),
      },
    }),
  ],
};
